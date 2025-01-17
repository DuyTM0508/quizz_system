import React, { useState } from 'react';
import { Container, Row, Col, ListGroup, Button, Form, InputGroup, Card, Pagination, ButtonGroup, Modal } from 'react-bootstrap';

// Mock data for testing, categorized by type
const mockQuestions = [
    { id: 1, type: 'ABCD', title: 'What is React?', description: 'Describe the React library and its purpose.', category: 'Frontend', hidden: false },
    { id: 2, type: 'True/False', title: 'JavaScript is a programming language.', description: 'True or False.', category: 'General', hidden: false },
    { id: 3, type: 'Multiple Choice', title: 'Which is a JavaScript framework?', description: 'a) React b) Angular c) Vue d) Node.js', category: 'Frontend', hidden: false },
    { id: 4, type: 'ABCD', title: 'What is MongoDB?', description: 'Describe the NoSQL database MongoDB.', category: 'Backend', hidden: true },
    { id: 5, type: 'Multiple Choice', title: 'Which is a SQL database?', description: 'a) MongoDB b) PostgreSQL c) Redis d) Cassandra', category: 'Backend', hidden: false },
    // Add more mock questions as needed...
];

const QuestList = () => {
    const [questions, setQuestions] = useState(mockQuestions);
    const [search, setSearch] = useState('');
    const [newQuestion, setNewQuestion] = useState({ type: '', title: '', description: '', category: '', hidden: false });
    const [editQuestion, setEditQuestion] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const questionsPerPage = 10; // Number of questions per page
    const [modalShow, setModalShow] = useState(false);

    const handleSearch = (e) => setSearch(e.target.value);

    const handleCreateQuestion = () => {
        setQuestions([...questions, { ...newQuestion, id: questions.length + 1 }]);
        setNewQuestion({ type: '', title: '', description: '', category: '', hidden: false });
        setModalShow(false); // Close modal after creating
    };

    const handleUpdateQuestion = () => {
        const updatedQuestions = questions.map((q) =>
            q.id === editQuestion.id ? { ...q, ...editQuestion } : q
        );
        setQuestions(updatedQuestions);
        setEditQuestion(null);
        setModalShow(false); // Close modal after updating
    };

    const handleDelete = (id) => {
        const updatedQuestions = questions.filter((question) => question.id !== id);
        setQuestions(updatedQuestions);
    };

    const toggleHide = (id) => {
        const updatedQuestions = questions.map((question) =>
            question.id === id ? { ...question, hidden: !question.hidden } : question
        );
        setQuestions(updatedQuestions);
    };

    const handleEdit = (question) => {
        setEditQuestion({ ...question });
        setModalShow(true); // Show modal when editing
    };

    // Filter and paginate the questions
    const filteredQuestions = questions.filter(
        (question) =>
            question.title.toLowerCase().includes(search.toLowerCase()) ||
            question.description.toLowerCase().includes(search.toLowerCase())
    );

    const indexOfLastQuestion = currentPage * questionsPerPage;
    const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
    const currentQuestions = filteredQuestions.slice(indexOfFirstQuestion, indexOfLastQuestion);

    const handlePagination = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
            <Container className="mt-4">
                <h1 className="text-center mb-4 bg-primary text-white p-3 rounded">
                    Question Bank
                </h1>

                {/* Buttons: Create New Question and Import Question */}
                <InputGroup className="mb-4 rounded">
                    <Form.Control
                        type="text"
                        placeholder="Search questions"
                        value={search}
                        onChange={handleSearch}
                        className="border-light shadow-sm"
                    />
                </InputGroup>

                <div className="text-center mb-1">
                    <ButtonGroup>
                        <Button variant="primary" onClick={() => setModalShow(true)} size="sm">
                            Create New Question
                        </Button>
                        <Button variant="info" onClick={() => alert('Import questions functionality')} size="sm">
                            Import Question
                        </Button>
                    </ButtonGroup>
                </div>

                {/* Question List */}
                <ListGroup as="ul" className="mt-4">
                    {currentQuestions.map((question) =>
                        !question.hidden && (
                            <ListGroup.Item
                                as="li"
                                key={question.id}
                                className="d-flex justify-content-between align-items-center mb-3 p-3 border rounded shadow-sm"
                            >
                                <Card className="w-100 border-0">
                                    <Card.Body>
                                        <h5 className="text-primary mb-0">{question.title}</h5>
                                        <small className="text-muted d-block">{question.category}</small>
                                        <p>{question.description}</p>
                                        <small className="text-muted">{question.type}</small>
                                    </Card.Body>
                                </Card>

                                <div className="d-flex align-items-center">
                                    <Button
                                        variant="info"
                                        size="sm"
                                        onClick={() => handleEdit(question)}
                                        className="mr-2 px-3 py-1"
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDelete(question.id)}
                                        className="mr-2 px-3 py-1"
                                    >
                                        Delete
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => toggleHide(question.id)}
                                        className="px-3 py-1"
                                    >
                                        {question.hidden ? 'Show' : 'Hide'}
                                    </Button>
                                </div>
                            </ListGroup.Item>
                        )
                    )}
                </ListGroup>

                {/* Pagination */}
                <div className="text-center mt-4">
                    <Pagination>
                        {[...Array(Math.ceil(filteredQuestions.length / questionsPerPage))].map((_, index) => (
                            <Pagination.Item
                                key={index + 1}
                                active={index + 1 === currentPage}
                                onClick={() => handlePagination(index + 1)}
                            >
                                {index + 1}
                            </Pagination.Item>
                        ))}
                    </Pagination>
                </div>
            </Container>

            {/* Modal for Creating/Updating Questions */}
            <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{editQuestion ? 'Edit Question' : 'Create New Question'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formQuestionType">
                            <Form.Label>Type</Form.Label>
                            <Form.Control
                                as="select"
                                value={newQuestion.type}
                                onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value })}
                            >
                                <option value="">Select Question Type</option>
                                <option value="ABCD">ABCD</option>
                                <option value="True/False">True/False</option>
                                <option value="Multiple Choice">Multiple Choice</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="formQuestionTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Question Title"
                                value={editQuestion ? editQuestion.title : newQuestion.title}
                                onChange={(e) => {
                                    if (editQuestion) {
                                        setEditQuestion({ ...editQuestion, title: e.target.value });
                                    } else {
                                        setNewQuestion({ ...newQuestion, title: e.target.value });
                                    }
                                }}
                            />
                        </Form.Group>

                        <Form.Group controlId="formQuestionDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Question Description"
                                value={editQuestion ? editQuestion.description : newQuestion.description}
                                onChange={(e) => {
                                    if (editQuestion) {
                                        setEditQuestion({ ...editQuestion, description: e.target.value });
                                    } else {
                                        setNewQuestion({ ...newQuestion, description: e.target.value });
                                    }
                                }}
                            />
                        </Form.Group>

                        <Form.Group controlId="formQuestionCategory">
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Category (e.g., Frontend, Backend)"
                                value={editQuestion ? editQuestion.category : newQuestion.category}
                                onChange={(e) => {
                                    if (editQuestion) {
                                        setEditQuestion({ ...editQuestion, category: e.target.value });
                                    } else {
                                        setNewQuestion({ ...newQuestion, category: e.target.value });
                                    }
                                }}
                            />
                        </Form.Group>

                        <Button
                            variant="primary"
                            onClick={editQuestion ? handleUpdateQuestion : handleCreateQuestion}
                            size="lg"
                        >
                            {editQuestion ? 'Update Question' : 'Create Question'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <footer className="d-flex flex-column flex-md-row text-center text-md-start justify-content-between py-4 px-4 px-xl-5 bg-primary">
                <div className="text-white mb-3 mb-md-0">
                    Copyright © 2020. All rights reserved.
                </div>
            </footer>
        </>
    );
};

export default QuestList;
