import React, { useState, useEffect } from "react";

function FlashCardForm({ onSubmit, editingCard }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        if (editingCard) {
            setTitle(editingCard.title);
            setDescription(editingCard.description);
            setQuestions(editingCard.questions || []);
        } else {
            setTitle("");
            setDescription("");
            setQuestions([]);
        }
    }, [editingCard]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ title, description, questions });
        setTitle("");
        setDescription("");
        setQuestions([]);
    };

    // Thêm câu hỏi mới
    const addQuestion = () => {
        setQuestions([...questions, { content: "", answers: [] }]);
    };

    // Cập nhật nội dung câu hỏi
    const updateQuestion = (index, newContent) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].content = newContent;
        setQuestions(updatedQuestions);
    };

    // Xóa câu hỏi
    const deleteQuestion = (index) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    // Thêm câu trả lời
    const addAnswer = (qIndex) => {
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex].answers.push({ content: "", isCorrect: false });
        setQuestions(updatedQuestions);
    };

    // Cập nhật câu trả lời
    const updateAnswer = (qIndex, aIndex, newContent, isCorrect) => {
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex].answers[aIndex] = { content: newContent, isCorrect };
        setQuestions(updatedQuestions);
    };

    // Xóa câu trả lời
    const deleteAnswer = (qIndex, aIndex) => {
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex].answers = updatedQuestions[qIndex].answers.filter((_, i) => i !== aIndex);
        setQuestions(updatedQuestions);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
            
            <h3>Questions</h3>
            {questions.map((question, qIndex) => (
                <div key={qIndex}>
                    <input 
                        type="text" 
                        placeholder="Question" 
                        value={question.content} 
                        onChange={(e) => updateQuestion(qIndex, e.target.value)} 
                    />
                    <button type="button" onClick={() => deleteQuestion(qIndex)}>❌ Delete Question</button>
                    
                    <h4>Answers:</h4>
                    {question.answers.map((answer, aIndex) => (
                        <div key={aIndex}>
                            <input 
                                type="text" 
                                placeholder="Answer" 
                                value={answer.content} 
                                onChange={(e) => updateAnswer(qIndex, aIndex, e.target.value, answer.isCorrect)} 
                            />
                            <input 
                                type="checkbox" 
                                checked={answer.isCorrect} 
                                onChange={(e) => updateAnswer(qIndex, aIndex, answer.content, e.target.checked)} 
                            />
                            <button type="button" onClick={() => deleteAnswer(qIndex, aIndex)}>Delete Answer</button>
                        </div>
                    ))}
                    <button type="button" onClick={() => addAnswer(qIndex)}>Add Answer</button>
                </div>
            ))}
            
            <button type="button" onClick={addQuestion}>➕ Add Question</button>
            <button type="submit">{editingCard ? "Update" : "Create FlashCard"}</button>
        </form>
    );
}

export default FlashCardForm;
