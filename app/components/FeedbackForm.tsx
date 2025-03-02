import React, { useRef } from 'react';
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
        <h2 style={{ 
          fontSize: '26px', 
          fontWeight: '600', 
          marginBottom: '15px',
          color: '#2c3e50',
          letterSpacing: '0.5px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <FaComment style={{ color: '#4a6741' }} />
          Share Your Feedback
        </h2>
        
        <p style={{ 
          fontSize: '15px', 
          textAlign: 'center', 
          maxWidth: '700px',
          margin: '0 0 20px 0',
          color: '#34495e',
          lineHeight: '1.5'
        }}>
          Your insights help us improve SpaceMyPDF. Please share any suggestions, report issues, or tell us how this tool has helped your workflow.
        </p>
        
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          style={{
            width: '80%',
            height: '80px',
            padding: '12px',
            border: '1px solid #ccc',
            borderRadius: '6px',
            marginBottom: '15px',
            resize: 'vertical',
            backgroundColor: 'rgba(255,255,255,0.8)',
            fontSize: '14px',
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
            fontFamily: 'inherit',
            lineHeight: '1.5',
            color: '#2c3e50'
          }}
          placeholder="Share your experience, suggestions, or report any issues you've encountered..."
        />
        
        <div style={{
          width: '80%',
          marginBottom: '15px',
          backgroundColor: 'rgba(255,255,255,0.7)',
          padding: '12px 15px',
          borderRadius: '6px',
          border: '1px solid #ddd',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px'
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
            margin: '0 0 10px 0',
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
                    width: '100px',
                    height: '100px',
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
          onClick={submitFeedback}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4a6741',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'background-color 0.2s',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          <FaPaperPlane size={14} />
          Submit Feedback
        </button>
      </div>
    </div>
  );
};

export default FeedbackForm; 