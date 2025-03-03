import React, { useRef, useEffect, useState } from 'react';
import { FaComment, FaPaperclip, FaTrash, FaPaperPlane } from 'react-icons/fa';

interface FeedbackFormProps {
  feedback: string;
  setFeedback: (feedback: string) => void;
  feedbackImages: File[];
  feedbackImagePreviews: string[];
  handleFeedbackImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearAllFeedbackImages: () => void;
  removeFeedbackImage: (index: number) => void;
  submitFeedback: () => void;
  feedbackSectionNeedsExtraHeight: boolean;
  feedbackSubmitted: boolean;
}

const FeedbackForm = ({
  feedback,
  setFeedback,
  feedbackImages,
  feedbackImagePreviews,
  handleFeedbackImageUpload,
  clearAllFeedbackImages,
  removeFeedbackImage,
  submitFeedback,
  feedbackSectionNeedsExtraHeight,
  feedbackSubmitted
}: FeedbackFormProps) => {
  const feedbackImageRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [currentUrl, setCurrentUrl] = useState('');
  const [isFirstSubmission, setIsFirstSubmission] = useState(true);
  
  // Set current URL on client side
  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);
  
  // Add event listener to handle form submission
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    
    const handleSubmit = async (e: Event) => {
      e.preventDefault();
      
      if (!feedback.trim()) {
        alert('Please enter some feedback before submitting.');
        return;
      }
      
      // Call the submitFeedback function which will handle UI updates
      submitFeedback();
      
      try {
        // For first-time submissions, show a note about activation
        if (isFirstSubmission) {
          console.log('First submission - check your email for activation link from FormSubmit');
          setIsFirstSubmission(false);
        }
        
        // If we have images, we need to use the standard form submission
        // as the AJAX endpoint doesn't properly handle file attachments
        if (feedbackImages.length > 0) {
          // Create a hidden form for submission
          const hiddenForm = document.createElement('form');
          hiddenForm.method = 'POST';
          hiddenForm.action = 'https://formsubmit.co/code.canogullari@gmail.com';
          hiddenForm.enctype = 'multipart/form-data';
          hiddenForm.style.display = 'none';
          hiddenForm.target = 'hidden_iframe';
          
          // Add the message
          const messageInput = document.createElement('input');
          messageInput.type = 'text';
          messageInput.name = 'message';
          messageInput.value = feedback;
          hiddenForm.appendChild(messageInput);
          
          // Add the subject
          const subjectInput = document.createElement('input');
          subjectInput.type = 'hidden';
          subjectInput.name = '_subject';
          subjectInput.value = `PDFextend Feedback - ${new Date().toLocaleString()}`;
          hiddenForm.appendChild(subjectInput);
          
          // Add the honeypot
          const honeypotInput = document.createElement('input');
          honeypotInput.type = 'text';
          honeypotInput.name = '_honey';
          honeypotInput.style.display = 'none';
          hiddenForm.appendChild(honeypotInput);
          
          // Add the template
          const templateInput = document.createElement('input');
          templateInput.type = 'hidden';
          templateInput.name = '_template';
          templateInput.value = 'table';
          hiddenForm.appendChild(templateInput);
          
          // Add autoresponse setting to prevent redirect
          const autoResponseInput = document.createElement('input');
          autoResponseInput.type = 'hidden';
          autoResponseInput.name = '_autoresponse';
          autoResponseInput.value = 'Your feedback has been received. Thank you!';
          hiddenForm.appendChild(autoResponseInput);
          
          // Disable CAPTCHA
          const captchaInput = document.createElement('input');
          captchaInput.type = 'hidden';
          captchaInput.name = '_captcha';
          captchaInput.value = 'false';
          hiddenForm.appendChild(captchaInput);
          
          // Add _next parameter to stay on the same page
          const nextInput = document.createElement('input');
          nextInput.type = 'hidden';
          nextInput.name = '_next';
          nextInput.value = window.location.href;
          hiddenForm.appendChild(nextInput);
          
          // Create hidden iframe to target the form submission
          let iframe = document.getElementById('hidden_iframe') as HTMLIFrameElement;
          if (!iframe) {
            iframe = document.createElement('iframe');
            iframe.name = 'hidden_iframe';
            iframe.id = 'hidden_iframe';
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
          }
          
          // Add images - use a different approach for multiple files
          if (feedbackImages.length === 1) {
            // For a single image, use the standard approach
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.name = 'attachment';
            
            // Create a DataTransfer object to set files
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(feedbackImages[0]);
            fileInput.files = dataTransfer.files;
            
            hiddenForm.appendChild(fileInput);
          } else {
            // For multiple images, use indexed names
            feedbackImages.forEach((image, index) => {
              const fileInput = document.createElement('input');
              fileInput.type = 'file';
              fileInput.name = `attachment${index + 1}`; // Use unique names for each attachment
              
              // Create a DataTransfer object to set files
              const dataTransfer = new DataTransfer();
              dataTransfer.items.add(image);
              fileInput.files = dataTransfer.files;
              
              hiddenForm.appendChild(fileInput);
            });
            
            // Add a count of attachments
            const countInput = document.createElement('input');
            countInput.type = 'hidden';
            countInput.name = 'attachment_count';
            countInput.value = feedbackImages.length.toString();
            hiddenForm.appendChild(countInput);
          }
          
          // Add the form to the document, submit it, and remove it
          document.body.appendChild(hiddenForm);
          hiddenForm.submit();
          
          // Set a timeout to remove the form after submission
          setTimeout(() => {
            document.body.removeChild(hiddenForm);
          }, 1000);
          
          console.log(`Feedback with ${feedbackImages.length} images submitted successfully!`);
        } else {
          // For submissions without images, use the AJAX endpoint
          const formData = new FormData();
          formData.append('message', feedback);
          formData.append('_subject', `PDFextend Feedback - ${new Date().toLocaleString()}`);
          formData.append('_captcha', 'false');
          
          // Send to FormSubmit via fetch to prevent page redirect
          const response = await fetch('https://formsubmit.co/ajax/code.canogullari@gmail.com', {
            method: 'POST',
            body: formData,
            headers: {
              'Accept': 'application/json'
            }
          });
          
          const result = await response.json();
          
          if (result.success === 'true' || result.success === true) {
            console.log('Feedback submitted successfully!');
          } else {
            throw new Error('Failed to submit feedback');
          }
        }
      } catch (error) {
        console.error('Error submitting feedback:', error);
      }
    };
    
    form.addEventListener('submit', handleSubmit);
    
    return () => {
      form.removeEventListener('submit', handleSubmit);
    };
  }, [feedback, feedbackImages, submitFeedback, isFirstSubmission]);

  return (
    <div style={{
      width: '100%',
      minHeight: feedbackSubmitted ? '500px' : (feedbackSectionNeedsExtraHeight ? '500px' : '400px'),
      padding: '15px 20px 90px 20px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      zIndex: 2,
      overflow: 'visible',
      borderRadius: '0 0 8px 8px'
    }}>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        width: '100%',
        flex: 1,
        position: 'relative',
        zIndex: 3,
        paddingTop: '5px',
        paddingBottom: '20px'
      }}>
        <h2 style={{ 
          fontSize: '22px', 
          fontWeight: '600', 
          marginBottom: '10px',
          color: '#2c3e50',
          letterSpacing: '0.5px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          justifyContent: 'center',
          textAlign: 'center'
        }}>
          {!feedbackSubmitted ? (
            <>
              <FaComment style={{ color: '#4a6741' }} />
              Tell Us What You Think
            </>
          ) : (
            <>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: '#4a6741' }}>
                <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-.997-6l7.07-7.071-1.414-1.414-5.656 5.657-2.829-2.829-1.414 1.414L11.003 16z" 
                  fill="currentColor"/>
              </svg>
              Thank You For Your Feedback
            </>
          )}
        </h2>
        
        <p style={{ 
          fontSize: '14px', 
          textAlign: 'center', 
          maxWidth: '700px',
          margin: '0 auto 15px auto',
          color: '#34495e',
          lineHeight: '1.4',
          width: '100%'
        }}>
          {!feedbackSubmitted ? 
            "Please share your feedback and include screenshots of any issues you encounter." :
            "We appreciate you taking the time to help us improve PDFextend."
          }
        </p>
        
        <div style={{
          width: '90%',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          position: 'relative',
          height: feedbackSubmitted ? '300px' : 'auto'
        }}>
          {!feedbackSubmitted ? (
            <form 
              ref={formRef}
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '15px'
              }}
              action="https://formsubmit.co/code.canogullari@gmail.com"
              method="POST"
              encType="multipart/form-data"
              target="hidden_iframe"
            >
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_template" value="table" />
              <input type="hidden" name="_subject" value={`PDFextend Feedback - ${new Date().toLocaleString()}`} />
              <input type="hidden" name="_next" value={currentUrl} />
              <input type="text" name="_honey" style={{ display: 'none' }} />
              
              <textarea
                name="message"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                style={{
                  width: '100%',
                  height: '120px',
                  padding: '12px',
                  border: '1px solid #ccc',
                  borderRadius: '6px',
                  marginBottom: '5px',
                  resize: 'none',
                  backgroundColor: 'rgba(255,255,255,0.8)',
                  fontSize: '14px',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
                  fontFamily: 'inherit',
                  lineHeight: '1.5',
                  color: '#2c3e50',
                  overflowY: 'auto',
                  boxSizing: 'border-box'
                }}
                placeholder="Share your thoughts, ideas, or any issues you've found. Screenshots of problems are very helpful!"
              />
              
              <div style={{
                width: '100%',
                marginBottom: '5px',
                backgroundColor: 'rgba(255,255,255,0.7)',
                padding: '12px',
                borderRadius: '6px',
                border: '1px solid #ccc',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                boxSizing: 'border-box'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '5px'
                }}>
                  <p style={{ 
                    margin: '0', 
                    fontSize: '15px', 
                    fontWeight: '600',
                    color: '#2c3e50',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <FaPaperclip style={{ color: '#4a6741' }} />
                    Attach Screenshots
                  </p>
                  
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => feedbackImageRef.current?.click()}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#4a6741',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        transition: 'background-color 0.2s'
                      }}
                    >
                      <FaPaperclip size={12} />
                      Add Image
                    </button>
                    
                    {feedbackImages.length > 0 && (
                      <button
                        type="button"
                        onClick={clearAllFeedbackImages}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#e74c3c',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          transition: 'background-color 0.2s'
                        }}
                      >
                        <FaTrash size={12} />
                        Clear All
                      </button>
                    )}
                  </div>
                </div>
                
                <input
                  ref={feedbackImageRef}
                  type="file"
                  name="attachment"
                  accept="image/*"
                  onChange={handleFeedbackImageUpload}
                  multiple
                  style={{ 
                    display: 'none'
                  }}
                />
                
                <p style={{ 
                  fontSize: '13px', 
                  color: '#666', 
                  margin: '0 0 5px 0',
                  fontStyle: 'italic'
                }}>
                  Maximum file size: 5MB per image
                </p>
                
                {feedbackImagePreviews.length > 0 && (
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '10px',
                    marginTop: '10px'
                  }}>
                    {feedbackImagePreviews.map((preview, index) => (
                      <div 
                        key={index} 
                        style={{
                          position: 'relative',
                          width: '80px',
                          height: '80px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}
                      >
                        <img 
                          src={preview} 
                          alt={`Preview ${index + 1}`} 
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeFeedbackImage(index)}
                          style={{
                            position: 'absolute',
                            top: '5px',
                            right: '5px',
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(231, 76, 60, 0.8)',
                            color: 'white',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            fontSize: '12px',
                            padding: '0'
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <button
                type="submit"
                style={{
                  padding: '10px 16px',
                  backgroundColor: '#4a6741',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'background-color 0.2s',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  width: '100%',
                  maxWidth: '200px',
                  margin: '0 auto'
                }}
              >
                <FaPaperPlane size={12} />
                Submit Feedback
              </button>
            </form>
          ) : (
            <div style={{ 
              padding: '25px 30px',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid #c3e6cb',
              borderRadius: '8px',
              color: '#155724',
              fontSize: '16px',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              width: '100%',
              maxWidth: '350px',
              margin: '0 auto',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 5,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '15px'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: '#4a6741',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '5px'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-.997-6l7.07-7.071-1.414-1.414-5.656 5.657-2.829-2.829-1.414 1.414L11.003 16z" 
                    fill="white"/>
                </svg>
              </div>
              <div>
                <h3 style={{ 
                  margin: '0 0 5px 0', 
                  color: '#2c3e50', 
                  fontSize: '18px', 
                  fontWeight: '600',
                  textAlign: 'center'
                }}>
                  Thank You!
                </h3>
                <p style={{ 
                  margin: '0', 
                  color: '#34495e', 
                  fontSize: '14px',
                  textAlign: 'center'
                }}>
                  Your feedback has been submitted successfully.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm; 