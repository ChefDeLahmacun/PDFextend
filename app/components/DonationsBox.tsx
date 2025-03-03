import React, { useEffect, useState, useRef } from 'react';
import Script from 'next/script';

declare global {
  interface Window {
    paypal: any;
  }
}

interface PayPalFundingEligibility {
  card?: {
    eligible: boolean;
  };
}

interface PayPalActions {
  getFundingEligibility(): Promise<PayPalFundingEligibility>;
}

const DonationsBox = () => {
  const [isPayPalLoaded, setIsPayPalLoaded] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCardSelected, setIsCardSelected] = useState(false);
  const buttonContainerRef = useRef<HTMLDivElement>(null);
  const buttonInstance = useRef<any>(null);
  const [donationAmount, setDonationAmount] = useState('1.00');
  const currentOrderRef = useRef<any>(null);
  // Add a timeout ref for debouncing
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Add a key state to force re-render of the PayPal button container
  const [buttonKey, setButtonKey] = useState<number>(0);
  // Add a ref to track the last clicked button
  const lastClickedButtonRef = useRef<string | null>(null);

  const initPayPalButton = () => {
    if (!window.paypal || !buttonContainerRef.current) return;

    try {
      // Cleanup previous instance if it exists
      if (buttonInstance.current) {
        buttonInstance.current.close();
      }

      buttonInstance.current = window.paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'paypal',
          height: 45
        },
        
        createOrder: (_data: any, actions: any) => {
          // Use the current donation amount
          const formattedAmount = formatAmount(donationAmount);
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: formattedAmount,
                currency_code: 'GBP'
              },
              description: 'Donation to SpaceMyPDF'
            }]
          });
        },
        
        onApprove: async (_data: any, actions: any) => {
          const order = await actions.order.capture();
          alert('Thank you for your donation!');
          console.log('Donation completed', order);
          setIsExpanded(false);
        },
        
        onError: (err: Error) => {
          console.error('PayPal error:', err);
          alert('There was an error processing your donation. Please try again.');
        },

        onInit: function(_data: any, actions: PayPalActions) {
          // Check if card funding is eligible
          actions.getFundingEligibility().then((fundingEligibility: PayPalFundingEligibility) => {
            if (fundingEligibility && fundingEligibility.card && fundingEligibility.card.eligible) {
              // Card funding is eligible, add event listener to track when card is selected
              const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                  if (mutation.type === 'attributes' || mutation.type === 'childList') {
                    // Check if card payment method is selected by looking for active card button
                    const cardButton = document.querySelector('[data-funding-source="card"].paypal-button-active');
                    const cardForm = document.querySelector('.paypal-card-form');
                    
                    const isNowCardSelected = !!(cardButton || cardForm);
                    
                    setIsCardSelected(isNowCardSelected);
                  }
                });
              });
              
              // Start observing the button container for changes
              if (buttonContainerRef.current) {
                observer.observe(buttonContainerRef.current, { 
                  attributes: true, 
                  childList: true,
                  subtree: true 
                });
              }
            }
          });
        },

        onClick: (data: any) => {
          // Store which button was clicked
          if (data && data.fundingSource) {
            lastClickedButtonRef.current = data.fundingSource;
          }
          
          // Update the order amount when the button is clicked
          if (validateAmount(donationAmount)) {
            // Format the amount
            const formatted = formatAmount(donationAmount);
            if (donationAmount !== formatted) {
              setDonationAmount(formatted);
            }
          } else {
            setDonationAmount('1.00');
          }
          
          setIsExpanded(true);
        },

        onCancel: () => {
          setIsExpanded(false);
        }
      });

      buttonInstance.current.render(buttonContainerRef.current);
      setIsPayPalLoaded(true);

    } catch (error) {
      console.error('Error initializing PayPal button:', error);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Don't format the amount during typing, just validate and set the raw value
    if (value === '') {
      setDonationAmount('');
    } else {
      // Only validate the format but don't convert to fixed decimal during typing
      const isValid = /^\d*\.?\d{0,2}$/.test(value);
      if (isValid) {
        setDonationAmount(value);
        
        // If the value is valid, update the PayPal button
        if (validateAmount(value)) {
          // Clear any existing timeout
          if (updateTimeoutRef.current) {
            clearTimeout(updateTimeoutRef.current);
          }
          
          // Set a new timeout to update the button after typing stops
          updateTimeoutRef.current = setTimeout(() => {
            // Increment the key to force a re-render of the PayPal button container
            setButtonKey(prevKey => prevKey + 1);
          }, 500); // 500ms debounce
        }
      }
    }
  };

  const handleAmountBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || !validateAmount(value)) {
      setDonationAmount('1.00');
      
      // Force re-render with default amount
      setButtonKey(prevKey => prevKey + 1);
    } else {
      // Format the amount with 2 decimal places when the field loses focus
      const formattedAmount = formatAmount(value);
      
      // Only update if the amount actually changed
      if (formattedAmount !== donationAmount) {
        setDonationAmount(formattedAmount);
        
        // Force re-render with formatted amount
        setButtonKey(prevKey => prevKey + 1);
      }
    }
  };

  const validateAmount = (value: string): boolean => {
    const num = parseFloat(value);
    return !isNaN(num) && num >= 0.01 && num <= 10000;
  };

  const formatAmount = (value: string): string => {
    const num = parseFloat(value);
    return num.toFixed(2);
  };

  // Effect to initialize the PayPal button when the component mounts or when buttonKey changes
  useEffect(() => {
    if (window.paypal) {
      initPayPalButton();
    }
  }, [buttonKey]); // Add buttonKey as a dependency

  // Add an effect to monitor the card section state
  useEffect(() => {
    // Function to check if the card section is open
    const checkCardSectionOpen = () => {
      const cardSection = document.querySelector('.paypal-card-form');
      const cardButton = document.querySelector('[data-funding-source="card"].paypal-button-active');
      
      // Update the isCardSelected state based on what we find in the DOM
      setIsCardSelected(!!(cardSection || cardButton));
    };

    // Set up a mutation observer to watch for changes in the button container
    if (buttonContainerRef.current) {
      const observer = new MutationObserver(() => {
        checkCardSectionOpen();
      });
      
      observer.observe(buttonContainerRef.current, { 
        childList: true, 
        subtree: true,
        attributes: true
      });
      
      // Initial check
      checkCardSectionOpen();
      
      return () => observer.disconnect();
    }
  }, [isPayPalLoaded]);

  // Clean up the timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div style={{
      minHeight: isExpanded ? '850px' : '230px',
      height: 'auto',
      backgroundColor: '#ffd9d9',
      marginTop: '-1px',
      marginBottom: '25px',
      borderRadius: '30px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      padding: '20px',
      paddingBottom: '30px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      position: 'relative',
      transition: 'min-height 0.3s ease-in-out'
    }}>
      <Script 
        src={`https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=GBP&locale=en_GB&intent=capture&components=buttons,funding-eligibility`}
        strategy="afterInteractive"
        onLoad={() => {
          console.log('PayPal script loaded');
          initPayPalButton();
        }}
        onError={(e) => {
          console.error('Error loading PayPal script:', e);
        }}
      />
      
      <h2 style={{
        fontSize: '22px',
        color: '#333',
        marginBottom: '10px',
        fontWeight: '600'
      }}>
        Support SpaceMyPDF
      </h2>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '15px',
        maxWidth: '800px'
      }}>
        <p style={{
          fontSize: '15px',
          color: '#555',
          margin: '0',
          lineHeight: '1.5'
        }}>
          If you find SpaceMyPDF helpful, please consider supporting it.
        </p>
        <p style={{
          fontSize: '16px',
          color: '#444',
          fontWeight: '500',
          margin: '0',
          lineHeight: '1.5'
        }}>
          Every donation counts, even just £1 makes a difference!
        </p>
        <p style={{
          fontSize: '15px',
          color: '#555',
          margin: '0',
          lineHeight: '1.5'
        }}>
          Your contribution helps keep the service free. All donations are processed securely through PayPal.
        </p>
      </div>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        alignItems: 'center',
        width: '100%',
        flex: 1
      }}>
        <div style={{
          marginBottom: '15px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          padding: '12px 20px',
          borderRadius: '8px',
          border: '1px solid rgba(0, 0, 0, 0.1)'
        }}>
          <label 
            htmlFor="donationAmount"
            style={{
              fontSize: '16px',
              color: '#333',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            Choose Your Donation Amount
            <span style={{ 
              color: '#e74c3c',
              fontSize: '18px',
              lineHeight: 1,
              marginLeft: '4px'
            }}>*</span>
          </label>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            position: 'relative'
          }}>
            <span style={{
              fontSize: '18px',
              color: '#333',
              fontWeight: '500'
            }}>£</span>
            <input
              id="donationAmount"
              type="number"
              value={donationAmount}
              onChange={handleAmountChange}
              min="0.01"
              max="10000"
              step="0.01"
              required
              aria-required="true"
              style={{
                width: '120px',
                padding: '8px 12px',
                fontSize: '16px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                textAlign: 'center',
                backgroundColor: 'white',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease'
              }}
              onBlur={handleAmountBlur}
            />
          </div>
          <p style={{
            fontSize: '13px',
            color: '#666',
            margin: '2px 0 0 0',
            fontStyle: 'italic'
          }}>
            Min: £0.01 - Max: £10,000
          </p>
        </div>

        <div 
          key={buttonKey}
          ref={buttonContainerRef}
          style={{ 
            width: '300px',
            minHeight: '45px',
            marginBottom: '0',
            position: 'relative'
          }}
        >
          {!isPayPalLoaded && (
            <div style={{
              width: '100%',
              height: '45px',
              backgroundColor: '#FFC439',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#003087',
              fontSize: '16px'
            }}>
              Loading PayPal...
            </div>
          )}
        </div>
        
        <div style={{ height: '10px' }}></div>
        
        <div className="donation-footer" style={{ 
          margin: '0',
          padding: '0'
        }}>
          <p style={{
            fontSize: '14px',
            color: '#666',
            textAlign: 'center',
            margin: '0'
          }}>
            🔒 Secure payments processed by PayPal with buyer and seller protection
          </p>
        </div>
      </div>
    </div>
  );
};

export default DonationsBox; 