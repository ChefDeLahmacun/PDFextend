import React, { useRef } from 'react';

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
  feedbackSectionNeedsExtraHeight
}: FeedbackFormProps) => {
  const feedbackImageRef = useRef<HTMLInputElement>(null);

  return (
    <div style={{
      width: '100%',
      minHeight: '300px',
      padding: '20px 20px 40px 20px',
      boxSizing: 'border-box',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      zIndex: 2,
      marginTop: '0'
    }}>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        width: '100%',
        flex: 1,
        position: 'relative',
        zIndex: 3,
        paddingTop: '5px'
      }}>
        <div style={{
          width: '80%',
          marginBottom: '10px',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '14px', lineHeight: '1.4', margin: '0 0 5px 0' }}>
            <strong>Help Improve This AI-Powered Tool!</strong> Your feedback is essential for making SpaceMyPDF even better for everyone.
          </p>
          <p style={{ fontSize: '14px', lineHeight: '1.4', margin: '0 0 5px 0' }}>
            As this application was created using artificial intelligence, your suggestions and bug reports are crucial for its improvement.
          </p>
          <p style={{ fontSize: '14px', lineHeight: '1.4', margin: '0' }}>
            Please describe any issues in detail and attach screenshots if possible to help us understand and fix problems quickly.
          </p>
        </div>
        
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          style={{
            width: '80%',
            height: '55px',
            padding: '10px',
            border: '1px solid black',
            borderRadius: '3px',
            marginBottom: '10px',
            resize: 'none',
            backgroundColor: 'rgba(255,255,255,0.7)',
            fontSize: '14px'
          }}
          placeholder="Enter your feedback, suggestions, or describe any bugs you've encountered..."
        />
        
        <div style={{
          width: '80%',
          marginBottom: '10px'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            width: '100%'
          }}>
            <p style={{ 
              fontSize: '14px', 
              fontWeight: 'bold', 
              margin: '0 0 5px 0' 
            }}>
              Attach Screenshots or Images (Optional)
            </p>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              gap: '10px',
              marginBottom: '5px'
            }}>
              <input
                ref={feedbackImageRef}
                type="file"
                accept="image/*"
                onChange={handleFeedbackImageUpload}
                multiple
                style={{ 
                  flex: 1,
                  fontSize: '14px'
                }}
              />
              
              {feedbackImages.length > 0 && (
                <button
                  onClick={clearAllFeedbackImages}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: 'white',
                    border: '1px solid black',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Clear All
                </button>
              )}
            </div>
            
            <p style={{ 
              fontSize: '12px', 
              margin: '0 0 5px 0',
              color: '#666'
            }}>
              Maximum file size: 5MB per image
            </p>
            
            {feedbackImagePreviews.length > 0 && (
              <div style={{
                width: '100%',
                marginTop: '10px',
                marginBottom: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                <p style={{ 
                  fontSize: '14px', 
                  margin: '0 0 5px 0',
                  fontWeight: 'bold'
                }}>
                  Attached Images ({feedbackImagePreviews.length}):
                </p>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '10px',
                  justifyContent: 'flex-start'
                }}>
                  {feedbackImagePreviews.map((preview, index) => (
                    <div key={index} style={{
                      position: 'relative',
                      border: '1px solid #ccc',
                      padding: '5px',
                      borderRadius: '3px',
                      backgroundColor: 'white',
                      width: '100px',
                      height: '100px'
                    }}>
                      <img 
                        src={preview} 
                        alt={`Feedback image ${index + 1}`} 
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          display: 'block'
                        }}
                      />
                      <button
                        onClick={() => removeFeedbackImage(index)}
                        style={{
                          position: 'absolute',
                          top: '-8px',
                          right: '-8px',
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          backgroundColor: 'white',
                          border: '1px solid #999',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          padding: 0,
                          lineHeight: 1
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <button 
          style={{
            padding: '8px 20px',
            backgroundColor: 'white',
            border: '1px solid black',
            borderRadius: '3px',
            cursor: 'pointer',
            marginBottom: '15px',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
          onClick={submitFeedback}
        >
          Submit Feedback
        </button>
      </div>
    </div>
  );
};

export default FeedbackForm; 