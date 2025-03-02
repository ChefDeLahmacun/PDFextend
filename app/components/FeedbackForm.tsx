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
    <div style={{ marginBottom: '30px' }}>
      <h3 style={{ marginBottom: '15px' }}>Feedback</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>Share Your Thoughts</p>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Tell us what you think about this tool, or report any issues you've encountered..."
          style={{
            width: '100%',
            minHeight: '100px',
            padding: '10px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            marginBottom: '10px'
          }}
        />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>Attach Screenshots (Optional)</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFeedbackImageUpload}
            ref={feedbackImageRef}
            style={{ maxWidth: '300px' }}
            multiple
          />
          {feedbackImages.length > 0 && (
            <button
              onClick={clearAllFeedbackImages}
              style={{
                padding: '5px 10px',
                backgroundColor: 'white',
                border: '1px solid #ccc',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            >
              Clear All
            </button>
          )}
        </div>
        
        {/* Image previews */}
        {feedbackImagePreviews.length > 0 && (
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '10px', 
            marginTop: '10px',
            maxHeight: feedbackSectionNeedsExtraHeight ? '300px' : '200px',
            overflowY: 'auto',
            padding: '10px',
            border: '1px solid #eee',
            borderRadius: '4px'
          }}>
            {feedbackImagePreviews.map((preview, index) => (
              <div key={index} style={{ position: 'relative', width: '100px', height: '100px' }}>
                <img
                  src={preview}
                  alt={`Feedback ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '4px'
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
                    backgroundColor: 'rgba(255, 0, 0, 0.7)',
                    color: 'white',
                    border: 'none',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 'bold'
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
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        Submit Feedback
      </button>
    </div>
  );
};

export default FeedbackForm; 