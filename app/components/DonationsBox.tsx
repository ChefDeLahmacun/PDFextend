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
  // Add a ref to track the current amount for PayPal
  const currentAmountRef = useRef('1.00');
  const currentOrderRef = useRef<any>(null);
  // Add a timeout ref for debouncing
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Add a key state to force re-render of the PayPal button container
  const [buttonKey, setButtonKey] = useState<number>(0);
  // Add a ref to track the last clicked button
  const lastClickedButtonRef = useRef<string | null>(null);
  // Add currency state
  const [selectedCurrency, setSelectedCurrency] = useState('GBP');
  // Add donation success state
  const [donationSuccess, setDonationSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  // Add payment method state
  const [paymentMethod, setPaymentMethod] = useState('');
  // Add loading error state
  const [loadingError, setLoadingError] = useState(false);
  const [loadAttempts, setLoadAttempts] = useState(0);
  // Add a state to track if we need to force update the button
  const [forceUpdate, setForceUpdate] = useState(false);
  
  // Currency options with symbols
  const currencies = [
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' }
  ];
  
  // Get current currency symbol
  const getCurrencySymbol = () => {
    const currency = currencies.find(c => c.code === selectedCurrency);
    return currency ? currency.symbol : '£';
  };

  const initPayPalButton = () => {
    if (!window.paypal) {
      console.error('PayPal SDK not available');
      setLoadingError(true);
      return;
    }
    
    if (!buttonContainerRef.current) {
      console.error('Button container ref not available');
      return;
    }

    console.log('Initializing PayPal button with currency:', selectedCurrency);
    console.log('Button container exists:', !!buttonContainerRef.current);
    console.log('PayPal object available:', !!window.paypal);
    console.log('PayPal Buttons available:', !!window.paypal.Buttons);

    try {
      // Cleanup previous instance if it exists
      if (buttonInstance.current) {
        console.log('Closing previous button instance');
        buttonInstance.current.close();
        buttonInstance.current = null;
      }

      // Check if the PayPal Buttons function is available
      if (!window.paypal.Buttons) {
        console.error('PayPal Buttons function is not available');
        setLoadingError(true);
        return;
      }

      buttonInstance.current = window.paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'paypal',
          height: 45,
          tagline: false
        },
        
        // Important: Do not specify fundingSource here to allow all payment methods
        // fundingSource: undefined, 
        
        createOrder: (_data: any, actions: any) => {
          try {
            // Always get the current donation amount from the ref at the time of order creation
            // This ensures we use the latest value even if the button wasn't re-rendered
            const formattedAmount = currentAmountRef.current;
            
            console.log(`Creating order for ${formattedAmount} ${selectedCurrency}`);
            console.log('Payment source:', _data?.fundingSource);
            
            // For card payments, we need to ensure the order is created properly
            const isCardPayment = _data?.fundingSource === 'card';
            if (isCardPayment) {
              console.log('Creating card payment order');
              
              // Store the payment source for later reference
              lastClickedButtonRef.current = 'card';
              
              // For card payments, we need to use a specific configuration
              return actions.order.create({
                intent: 'CAPTURE',
                purchase_units: [{
                  amount: {
                    value: formattedAmount,
                    currency_code: selectedCurrency,
                    breakdown: {
                      item_total: {
                        currency_code: selectedCurrency,
                        value: formattedAmount
                      }
                    }
                  },
                  description: 'Donation to SpaceMyPDF',
                  items: [{
                    name: 'Donation',
                    description: 'Donation to SpaceMyPDF',
                    quantity: '1',
                    unit_amount: {
                      currency_code: selectedCurrency,
                      value: formattedAmount
                    },
                    category: 'DIGITAL_GOODS'
                  }],
                  shipping_preference: 'NO_SHIPPING'
                }],
                application_context: {
                  shipping_preference: 'NO_SHIPPING',
                  user_action: 'PAY_NOW',
                  brand_name: 'SpaceMyPDF',
                  landing_page: 'BILLING',
                  payment_method: {
                    payer_selected: 'PAYPAL',
                    payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED'
                  }
                }
              });
            }
            
            // For PayPal payments, use the standard configuration
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: formattedAmount,
                  currency_code: selectedCurrency // Use selected currency
                },
                description: 'Donation to SpaceMyPDF',
                // Add shipping preference to indicate no shipping is required
                shipping_preference: 'NO_SHIPPING'
              }],
              // Add application context to specify this is a donation
              application_context: {
                shipping_preference: 'NO_SHIPPING',
                user_action: 'PAY_NOW',
                brand_name: 'SpaceMyPDF',
                landing_page: 'LOGIN'
              }
            });
          } catch (error) {
            console.error('Error creating order:', error);
            alert('There was an error creating your donation. Please try again or use the direct PayPal link.');
            throw error;
          }
        },
        
        onApprove: async (_data: any, actions: any) => {
          try {
            console.log('Payment approved, capturing order...');
            
            // Add more detailed logging
            console.log('Payment data:', _data);
            console.log('Payment source:', _data.fundingSource);
            console.log('Order ID:', _data.orderID);
            
            // Add a more robust capture with better error handling
            let order;
            try {
              console.log('Attempting to capture order...');
              
              // For card payments, we need to ensure we're using the correct capture method
              const isCardPayment = _data.fundingSource === 'card';
              if (isCardPayment) {
                console.log('Processing card payment capture');
              }
              
              // Use a timeout to ensure the PayPal system has time to process the payment
              await new Promise(resolve => setTimeout(resolve, 1000));
              
              order = await actions.order.capture();
              console.log('Order capture successful:', order);
            } catch (captureError) {
              console.error('Error during order capture:', captureError);
              
              // Try to get order details even if capture failed
              try {
                console.log('Attempting to get order details after capture failure...');
                const orderDetails = await actions.order.get();
                console.log('Order details despite capture failure:', orderDetails);
                
                // For card payments, sometimes the capture fails but the payment still went through
                // In this case, we'll treat it as a success if we can get the order details
                if (_data.fundingSource === 'card' && orderDetails) {
                  console.log('Using order details as fallback for card payment');
                  order = orderDetails;
                } else {
                  throw captureError;
                }
              } catch (getOrderError) {
                console.error('Could not get order details:', getOrderError);
                throw captureError;
              }
            }
            
            // More detailed logging of the completed order
            console.log('Donation completed - Full order details:', JSON.stringify(order));
            
            // Detect payment method with more detail
            let paymentMethodUsed = 'PayPal';
            let paymentDetails = '';
            
            if (order.payment_source) {
              console.log('Payment source:', order.payment_source);
              
              if (order.payment_source.card) {
                const card = order.payment_source.card;
                paymentMethodUsed = `Card (${card.brand || 'Unknown'} ${card.last_digits || 'xxxx'})`;
                paymentDetails = `${card.brand || 'Card'} ending in ${card.last_digits || 'xxxx'}`;
                console.log('Card payment detected:', paymentDetails);
              } else if (order.payment_source.paypal) {
                const pp = order.payment_source.paypal;
                paymentMethodUsed = `PayPal (${pp.email_address || 'Unknown'})`;
                paymentDetails = pp.email_address || 'Unknown PayPal account';
                console.log('PayPal payment detected:', paymentDetails);
              } else {
                console.log('Unknown payment source type:', order.payment_source);
              }
            } else if (_data.fundingSource === 'card') {
              // Fallback for card payments when payment_source is not available
              paymentMethodUsed = 'Credit/Debit Card';
              console.log('Card payment detected via fundingSource');
            } else {
              console.log('No payment source information in the order');
            }
            
            // Update state with transaction details
            setIsExpanded(false);
            setDonationSuccess(true);
            setTransactionId(order.id || _data.orderID || 'Unknown');
            setPaymentMethod(paymentMethodUsed);
            
            // Log success state update
            console.log('Updated UI with success state:', {
              transactionId: order.id || _data.orderID,
              paymentMethod: paymentMethodUsed
            });
            
            return order;
          } catch (error: any) {
            console.error('Error capturing order:', error);
            
            // More detailed error alert
            alert(`There was an error processing your donation: ${error.message || 'Unknown error'}. Please try again or use the direct PayPal link.`);
            
            // Rethrow to ensure PayPal handles the error
            throw error;
          }
        },
        
        onError: (err: Error) => {
          console.error('PayPal error:', err);
          console.error('Error details:', err.message);
          console.error('Error stack:', err.stack);
          
          // More detailed error alert
          alert(`PayPal error: ${err.message || 'Unknown error'}. Please try again or use the direct PayPal link.`);
        },

        onInit: function(_data: any, actions: PayPalActions) {
          console.log('PayPal button initialized');
          
          // Check if card funding is eligible
          actions.getFundingEligibility().then((fundingEligibility: PayPalFundingEligibility) => {
            console.log('Funding eligibility:', fundingEligibility);
            
            if (fundingEligibility && fundingEligibility.card && fundingEligibility.card.eligible) {
              console.log('Card funding is eligible');
              
              // Card funding is eligible, add event listener to track when card is selected
              const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                  if (mutation.type === 'attributes' || mutation.type === 'childList') {
                    // Check if card payment method is selected by looking for active card button
                    const cardButton = document.querySelector('[data-funding-source="card"].paypal-button-active');
                    const cardForm = document.querySelector('.paypal-card-form');
                    
                    const isNowCardSelected = !!(cardButton || cardForm);
                    
                    if (isNowCardSelected && !isCardSelected) {
                      console.log('Card payment method activated');
                    }
                    
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
                
                console.log('Observing button container for card selection');
              }
            } else {
              console.warn('Card funding is not eligible');
            }
          }).catch(error => {
            console.error('Error checking funding eligibility:', error);
          });
        },

        onClick: (data: any) => {
          // Store which button was clicked
          if (data && data.fundingSource) {
            lastClickedButtonRef.current = data.fundingSource;
            console.log('Payment method selected:', data.fundingSource);
            
            // Set card selected state if card is the funding source
            if (data.fundingSource === 'card') {
              setIsCardSelected(true);
              console.log('Card payment method selected');
              
              // Log additional information for card payments
              console.log('Card payment flow initiated');
              console.log('Current amount:', currentAmountRef.current);
              console.log('Current currency:', selectedCurrency);
              
              // Force a small delay to ensure the card form is properly initialized
              setTimeout(() => {
                console.log('Card form should be visible now');
                
                // Check if the card form is visible in the DOM
                const cardForm = document.querySelector('.paypal-card-form');
                console.log('Card form found in DOM:', !!cardForm);
              }, 1000);
            }
          }
          
          // Update the order amount when the button is clicked
          // This ensures we use the current value without needing to re-render the button
          if (validateAmount(donationAmount)) {
            // Format the amount and update the ref
            const formatted = formatAmount(donationAmount);
            if (formatted !== currentAmountRef.current) {
              console.log(`Updating amount on click: ${currentAmountRef.current} -> ${formatted}`);
              currentAmountRef.current = formatted;
              
              // Only update state if different to avoid unnecessary re-renders
              if (donationAmount !== formatted) {
                setDonationAmount(formatted);
              }
            }
          } else {
            // If invalid, set to default
            currentAmountRef.current = '1.00';
            setDonationAmount('1.00');
          }
          
          setIsExpanded(true);
        },

        onCancel: () => {
          setIsExpanded(false);
        }
      });

      console.log('Rendering PayPal button to container');
      const renderResult = buttonInstance.current.render(buttonContainerRef.current);
      console.log('Render result:', renderResult);
      setIsPayPalLoaded(true);

    } catch (error) {
      console.error('Error initializing PayPal button:', error);
      // Show a more user-friendly error
      alert('There was an error loading the PayPal button. Please refresh the page and try again.');
      setLoadingError(true);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Allow empty values during typing
    if (value === '') {
      setDonationAmount('');
      // Don't update the ref or force any updates yet
      // This allows the user to delete the entire value without it being reset
      return;
    }
    
    // Only validate the format but don't convert to fixed decimal during typing
    const isValid = /^\d*\.?\d{0,2}$/.test(value);
    if (isValid) {
      setDonationAmount(value);
      
      // If the value is valid and significantly different from the current amount,
      // we need to force an update of the PayPal button
      if (validateAmount(value)) {
        // Clear any existing timeout
        if (updateTimeoutRef.current) {
          clearTimeout(updateTimeoutRef.current);
        }
        
        // Use a longer timeout (2 seconds) to avoid formatting while the user is still typing
        updateTimeoutRef.current = setTimeout(() => {
          const formattedAmount = formatAmount(value);
          
          // Check if the amount has changed significantly (more than just formatting)
          // This prevents unnecessary updates for small formatting changes
          const currentAmountFloat = parseFloat(currentAmountRef.current);
          const newAmountFloat = parseFloat(formattedAmount);
          const difference = Math.abs(currentAmountFloat - newAmountFloat);
          
          // If the difference is significant or we're in card mode, force an update
          if (difference >= 0.01 || isCardSelected) {
            console.log(`Amount changed significantly: ${currentAmountRef.current} -> ${formattedAmount}`);
            currentAmountRef.current = formattedAmount;
            setDonationAmount(formattedAmount);
            
            // Force a complete re-render of the PayPal button
            if (buttonInstance.current) {
              try {
                buttonInstance.current.close();
                buttonInstance.current = null;
              } catch (error) {
                console.error('Error closing PayPal button:', error);
              }
            }
            
            // Set the force update flag to true
            setForceUpdate(true);
            
            // Force re-render with new key
            setButtonKey(prevKey => prevKey + 1);
          }
        }, 2000); // Increased to 2 seconds to give more time for typing
      }
    }
  };

  const handleAmountBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let needsUpdate = false;
    
    // Only set default value if the field is completely empty or invalid
    if (value === '') {
      console.log('Field is empty on blur, setting default amount');
      setDonationAmount('1.00');
      currentAmountRef.current = '1.00';
      needsUpdate = true;
    } else if (!validateAmount(value)) {
      // If the value is invalid (but not empty), set to default
      console.log('Invalid amount on blur, setting default amount');
      setDonationAmount('1.00');
      currentAmountRef.current = '1.00';
      needsUpdate = true;
    } else {
      // Format the amount with 2 decimal places when the field loses focus
      const formattedAmount = formatAmount(value);
      
      // Only update if the amount actually changed
      if (formattedAmount !== donationAmount) {
        console.log(`Formatting amount on blur: ${donationAmount} -> ${formattedAmount}`);
        setDonationAmount(formattedAmount);
        currentAmountRef.current = formattedAmount;
        needsUpdate = true;
      }
    }
    
    // Always force an update on blur if the card form is open
    // This ensures the amount is updated in the PayPal interface
    if (needsUpdate || isCardSelected) {
      // Force a complete re-render of the PayPal button
      if (buttonInstance.current) {
        try {
          buttonInstance.current.close();
          buttonInstance.current = null;
        } catch (error) {
          console.error('Error closing PayPal button:', error);
        }
      }
      
      // Set the force update flag to true
      setForceUpdate(true);
      
      // Force re-render with new key
      setButtonKey(prevKey => prevKey + 1);
    }
  };

  const validateAmount = (value: string): boolean => {
    // During typing, allow partial inputs like "0." or "."
    if (value === '.' || value === '0.' || value.match(/^\d+\.$/)) {
      return true;
    }
    
    const num = parseFloat(value);
    return !isNaN(num) && num >= 0.01 && num <= 10000;
  };

  const formatAmount = (value: string): string => {
    const num = parseFloat(value);
    return num.toFixed(2);
  };

  // Handle currency change
  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCurrency = e.target.value;
    setSelectedCurrency(newCurrency);
    
    // Currency changes require a reload of the PayPal SDK
    // But we'll make it as seamless as possible
    setButtonKey(prevKey => prevKey + 1);
  };

  // Add function to reset donation success state
  const resetDonationSuccess = () => {
    // First set donation success to false
    setDonationSuccess(false);
    setTransactionId('');
    setPaymentMethod('');
    
    // Then increment the button key to force a complete re-render of the button container
    // Use a slight delay to ensure state updates have completed
    setTimeout(() => {
      setButtonKey(prevKey => prevKey + 1);
    }, 50);
  };

  // Add function to manually reload PayPal
  const handleManualReload = () => {
    console.log('Manual reload requested');
    // First unmount the PayPal button by setting a temporary flag
    setIsPayPalLoaded(false);
    
    // Then after a short delay, trigger a complete remount
    setTimeout(() => {
      setLoadAttempts(prev => prev + 1);
      setButtonKey(prev => prev + 1);
      setLoadingError(false);
    }, 100);
  };

  // Add function to create a direct PayPal donation URL
  const getDirectPayPalUrl = () => {
    // For sandbox testing, use a different URL
    if (process.env.NODE_ENV === 'development') {
      // In development, we're using the sandbox environment
      const sandboxEmail = process.env.NEXT_PUBLIC_PAYPAL_SANDBOX_BUSINESS_EMAIL || 'sb-543y7w37766112@business.example.com';
      console.log('Using sandbox business email for direct link:', sandboxEmail);
      return `https://www.sandbox.paypal.com/donate?business=${encodeURIComponent(sandboxEmail)}&amount=${donationAmount}&currency_code=${selectedCurrency}&item_name=Donation%20to%20SpaceMyPDF%20(Test)`;
    }
    
    // For production
    const businessEmail = process.env.NEXT_PUBLIC_PAYPAL_BUSINESS_EMAIL || 'YourPayPalEmail@example.com';
    console.log('Using production business email for direct link:', businessEmail);
    return `https://www.paypal.com/donate?business=${encodeURIComponent(businessEmail)}&amount=${donationAmount}&currency_code=${selectedCurrency}&item_name=Donation%20to%20SpaceMyPDF`;
  };

  // Add function to check PayPal configuration
  const checkPayPalConfiguration = () => {
    console.log('Checking PayPal configuration...');
    console.log('Environment:', process.env.NODE_ENV);
    
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    console.log('Client ID available:', !!clientId);
    
    // Check if client ID looks valid (should be a long string)
    if (clientId) {
      if (clientId.length < 20) {
        console.error('WARNING: Client ID appears to be too short. It may not be valid.');
      } else {
        console.log('Client ID length looks valid:', clientId.length);
      }
    } else {
      console.error('ERROR: No PayPal Client ID found. PayPal integration will not work.');
    }
    
    console.log('Merchant ID available:', !!process.env.NEXT_PUBLIC_PAYPAL_MERCHANT_ID);
    
    // Check if we're in development mode
    if (process.env.NODE_ENV === 'development') {
      console.log('In development mode - using sandbox');
      console.log('Sandbox business email:', process.env.NEXT_PUBLIC_PAYPAL_SANDBOX_BUSINESS_EMAIL);
    } else {
      console.log('In production mode');
      console.log('Business email available:', !!process.env.NEXT_PUBLIC_PAYPAL_BUSINESS_EMAIL);
    }
  };

  // Add function to check if card payments are properly configured
  const checkCardPaymentsConfiguration = () => {
    console.log('Checking card payments configuration...');
    
    // Check if we're in development mode
    if (process.env.NODE_ENV === 'development') {
      console.log('In development mode - using sandbox for card payments');
      
      // Check if the PayPal SDK is configured for card payments
      if (window.paypal) {
        if (window.paypal.FUNDING && window.paypal.FUNDING.CARD) {
          console.log('Card funding source is available in PayPal SDK');
          
          // Check if the card funding source is enabled
          try {
            const cardFunding = window.paypal.FUNDING.CARD;
            console.log('Card funding source:', cardFunding);
            
            // Check if the card button is rendered
            setTimeout(() => {
              const cardButton = document.querySelector('[data-funding-source="card"]');
              console.log('Card button found in DOM:', !!cardButton);
              
              if (!cardButton) {
                console.warn('Card button not found in DOM. This may indicate that card payments are not available for your account or region.');
                console.log('Try adding &debug=true to the PayPal SDK URL for more detailed information.');
              }
            }, 2000);
          } catch (error) {
            console.error('Error checking card funding source:', error);
          }
        } else {
          console.warn('Card funding source may not be available in PayPal SDK');
        }
        
        // Check if the Buttons component supports card payments
        if (window.paypal.Buttons) {
          try {
            const isEligible = window.paypal.Buttons.isEligible({
              fundingSource: window.paypal.FUNDING?.CARD
            });
            console.log('Card payments eligible:', isEligible);
            
            if (!isEligible) {
              console.warn('Card payments are not eligible. This may be due to account restrictions or regional limitations.');
            }
          } catch (error) {
            console.error('Error checking card payment eligibility:', error);
          }
        }
      }
    }
  };

  // Effect to initialize the PayPal button when the component mounts or when buttonKey or selectedCurrency changes
  useEffect(() => {
    // Only initialize if we're not in success state and PayPal is available
    // and the button hasn't been initialized yet by the script onLoad handler
    if (window.paypal && !donationSuccess && (forceUpdate || (!buttonInstance.current && isPayPalLoaded))) {
      console.log('Initializing PayPal button from useEffect');
      
      // Reset the force update flag
      if (forceUpdate) {
        setForceUpdate(false);
      }
      
      // Small delay to ensure the DOM is ready
      const timer = setTimeout(() => {
        initPayPalButton();
      }, 100);
      
      // Cleanup function
      return () => {
        clearTimeout(timer);
        // Clean up PayPal button instance if it exists
        if (buttonInstance.current) {
          try {
            console.log('Cleaning up PayPal button instance');
            buttonInstance.current.close();
            buttonInstance.current = null;
          } catch (error) {
            console.error('Error cleaning up PayPal button:', error);
          }
        }
      };
    }
  }, [buttonKey, selectedCurrency, donationSuccess, loadAttempts, isPayPalLoaded, forceUpdate]);

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

  // Call the check function when component mounts
  useEffect(() => {
    checkPayPalConfiguration();
  }, []);

  // Call the card payments check after PayPal is loaded
  useEffect(() => {
    if (isPayPalLoaded && window.paypal) {
      checkCardPaymentsConfiguration();
    }
  }, [isPayPalLoaded]);

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
        src={`https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=${selectedCurrency}&intent=capture&enable-funding=card&disable-funding=paylater,venmo&locale=en_GB&commit=true`}
        strategy="afterInteractive"
        onLoad={() => {
          console.log('PayPal script loaded successfully');
          
          // Check if card funding is available
          if (window.paypal && window.paypal.FUNDING) {
            console.log('Card funding enabled:', window.paypal.FUNDING.CARD);
            console.log('Available funding sources:', Object.keys(window.paypal.FUNDING).filter(key => 
              window.paypal.FUNDING[key] !== undefined
            ));
          }
          
          // Initialize the PayPal button immediately
          if (window.paypal && buttonContainerRef.current) {
            setTimeout(() => {
              initPayPalButton();
            }, 500); // Add a small delay to ensure DOM is fully ready
          }
          
          // Set the loaded state after initialization
          setIsPayPalLoaded(true);
          setLoadingError(false);
        }}
        onError={(e) => {
          console.error('Error loading PayPal script:', e);
          console.error('Client ID used:', process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID);
          setLoadingError(true);
          
          // Retry loading after a delay, up to 3 times
          if (loadAttempts < 3) {
            setTimeout(() => {
              console.log(`Retrying PayPal script load (attempt ${loadAttempts + 1})`);
              setLoadAttempts(prev => prev + 1);
              setButtonKey(prev => prev + 1); // Force script reload
            }, 2000);
          }
        }}
        key={`paypal-script-${selectedCurrency}-${buttonKey}-${loadAttempts}`} // Add loadAttempts to force reload
      />
      
      <h2 style={{
        fontSize: '22px',
        color: '#333',
        marginBottom: '10px',
        fontWeight: '600'
      }}>
        Support SpaceMyPDF
      </h2>
      
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '8px 12px',
          borderRadius: '4px',
          marginBottom: '15px',
          fontSize: '14px',
          fontWeight: '500',
          border: '1px solid #f5c6cb'
        }}>
          🧪 Test Mode Active - No real payments will be processed
        </div>
      )}
      
      {donationSuccess ? (
        <div style={{
          backgroundColor: '#d4edda',
          color: '#155724',
          padding: '20px',
          borderRadius: '8px',
          marginTop: '15px',
          marginBottom: '15px',
          width: '80%',
          maxWidth: '500px',
          border: '1px solid #c3e6cb',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '15px'
        }}>
          <div style={{
            fontSize: '50px',
            marginBottom: '10px'
          }}>
            🎉
          </div>
          <h3 style={{
            fontSize: '20px',
            margin: '0 0 10px 0'
          }}>
            Thank You For Your Donation!
          </h3>
          <p style={{
            fontSize: '16px',
            margin: '0 0 5px 0'
          }}>
            Your support helps keep SpaceMyPDF free for everyone.
          </p>
          <div style={{
            fontSize: '14px',
            color: '#666',
            margin: '10px 0 0 0',
            padding: '10px',
            backgroundColor: 'rgba(255,255,255,0.5)',
            borderRadius: '4px',
            width: '100%'
          }}>
            Transaction ID: {transactionId}
          </div>
          <p style={{
            fontSize: '14px',
            color: '#666',
            margin: '10px 0 0 0',
            padding: '10px',
            backgroundColor: 'rgba(255,255,255,0.5)',
            borderRadius: '4px',
            width: '100%'
          }}>
            Payment Method: {paymentMethod}
          </p>
          <button 
            onClick={resetDonationSuccess}
            style={{
              marginTop: '15px',
              padding: '8px 16px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Make Another Donation
          </button>
        </div>
      ) : (
        <div>
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
              {/* Add currency selector */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '10px',
                width: '100%',
                justifyContent: 'center'
              }}>
                <label 
                  htmlFor="currencySelector"
                  style={{
                    fontSize: '16px',
                    color: '#333',
                    fontWeight: '600'
                  }}
                >
                  Currency:
                </label>
                <select
                  id="currencySelector"
                  value={selectedCurrency}
                  onChange={handleCurrencyChange}
                  style={{
                    padding: '6px 10px',
                    fontSize: '14px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    backgroundColor: 'white',
                    cursor: 'pointer'
                  }}
                >
                  {currencies.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code} ({currency.symbol}) - {currency.name}
                    </option>
                  ))}
                </select>
              </div>
              
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
                }}>{getCurrencySymbol()}</span>
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
                Min: {getCurrencySymbol()}0.01 - Max: {getCurrencySymbol()}10,000
              </p>
            </div>

            {/* Only render the PayPal button container when not in success state */}
            {!donationSuccess && (
              <>
                {/* PayPal SDK Button Container */}
                <div key={`paypal-outer-container-${buttonKey}-${loadAttempts}`} style={{ 
                  border: '1px solid transparent', 
                  padding: '2px',
                  minHeight: '45px',
                  width: '300px',
                  position: 'relative'
                }}>
                  {forceUpdate && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(255, 255, 255, 0.7)',
                      zIndex: 10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        border: '3px solid rgba(0, 0, 0, 0.1)',
                        borderTop: '3px solid #003087',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                      }}></div>
                      <style jsx>{`
                        @keyframes spin {
                          0% { transform: rotate(0deg); }
                          100% { transform: rotate(360deg); }
                        }
                      `}</style>
                    </div>
                  )}
                  <div 
                    key={`paypal-button-container-${buttonKey}-${loadAttempts}`}
                    ref={buttonContainerRef}
                    style={{ 
                      width: '300px',
                      minHeight: '45px',
                      marginBottom: '0',
                      position: 'relative',
                      backgroundColor: 'transparent'
                    }}
                  >
                    {!isPayPalLoaded && !forceUpdate && (
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
                </div>
                
                {/* Always show direct card payment button */}
                {false && isPayPalLoaded && (
                  <div style={{ 
                    marginTop: '10px',
                    width: '300px'
                  }}>
                    <a 
                      href={`${getDirectPayPalUrl()}&fundingSource=card`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        width: '100%',
                        height: '45px',
                        backgroundColor: '#000000',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        textDecoration: 'none'
                      }}
                    >
                      <span>Pay with</span>
                      <span style={{ fontWeight: 'bold' }}>Debit or Credit Card</span>
                    </a>
                    <p style={{ 
                      fontSize: '12px', 
                      color: '#666', 
                      marginTop: '5px',
                      textAlign: 'center'
                    }}>
                      Secure card payment via PayPal (no account needed)
                    </p>
                  </div>
                )}
              </>
            )}
            
            <div style={{ height: '10px' }}></div>
            
            {!isPayPalLoaded && (
              <div style={{
                padding: '10px',
                backgroundColor: loadingError ? '#f8d7da' : '#fff3cd',
                color: loadingError ? '#721c24' : '#856404',
                borderRadius: '4px',
                marginTop: '10px',
                fontSize: '14px',
                border: loadingError ? '1px solid #f5c6cb' : '1px solid #ffeeba'
              }}>
                {loadingError ? (
                  <>
                    <p style={{ fontWeight: 'bold', margin: '0 0 8px 0' }}>
                      PayPal failed to load after multiple attempts.
                    </p>
                    <ul style={{ textAlign: 'left', margin: '0 0 10px 0', paddingLeft: '20px' }}>
                      <li>Check your internet connection</li>
                      <li>Try refreshing the page</li>
                      <li>Try using a different browser</li>
                      <li>Disable any ad blockers or privacy extensions</li>
                    </ul>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                      <button 
                        onClick={handleManualReload}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#007bff',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          width: '150px'
                        }}
                      >
                        Try Again
                      </button>
                      <p style={{ margin: '5px 0', fontSize: '13px' }}>or</p>
                      <a 
                        href="https://paypal.me/spacemypdf" 
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#28a745',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          textDecoration: 'none',
                          display: 'inline-block',
                          width: '150px',
                          textAlign: 'center'
                        }}
                      >
                        Donate via PayPal.me
                      </a>
                    </div>
                  </>
                ) : (
                  'PayPal is taking longer than expected to load. Please wait...'
                )}
              </div>
            )}
            
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
      )}
    </div>
  );
};

export default DonationsBox; 