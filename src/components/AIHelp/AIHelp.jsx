// AIHelp.js
import React, { useState } from 'react';
import styles from './AIHelp.module.css'; // Update the path if necessary

const AIHelp = ({ task, fetchAIResponse, aiResponse, breakdownTask }) => {
    const [showUserPrompt, setShowUserPrompt] = useState(false);
    const [userPrompt, setUserPrompt] = useState('');
    //const [aiResponse, setAIResponse] = useState(null);

    return (
        <div className={styles.aiAssistance}>
            <p>Having trouble breaking your task into sub-tasks? Here's an AI tool to help generate sub-tasks for you:</p>
            <button 
                onClick={() => breakdownTask()} 
                className={styles.aiGeneratePromptButton}
            >
                Generate Sub-Tasks with AI
            </button>
            <button 
                onClick={() => setShowUserPrompt(true)} 
                className={styles.aiCustomPromptButton}
            >
                Provide Your Own Prompt
            </button>

            {showUserPrompt && (
                <div className={styles.userPromptInput}>
                    <input 
                        type="text" 
                        value={userPrompt} 
                        onChange={(e) => setUserPrompt(e.target.value)} 
                        placeholder="Enter your custom prompt here"
                    />
                    <button 
                        onClick={() => fetchAIResponse(userPrompt)} 
                        className={styles.sendPromptButton}
                    >
                        Send Custom Prompt
                    </button>
                </div>
            )}

            {aiResponse && (
                <div className={styles.aiResponse}>
                    <h4>AI Generated Response:</h4>
                    {aiResponse.split('\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AIHelp;
