import React, { useState } from 'react';
import { Container, ListGroup, Button, Form, InputGroup, Card, Pagination, ButtonGroup, Modal } from 'react-bootstrap';

const mockExams = [
    { id: 1, title: 'Midterm Exam', description: 'This is the midterm exam for class 10A.', category: 'Math', duration: 60, hidden: false },
    { id: 2, title: 'Final Exam', description: 'End of term exam.', category: 'English', duration: 90, hidden: false },
    { id: 3, title: 'Practice Test', description: 'For practice only.', category: 'Science', duration: 45, hidden: true },
    { id: 4, title: 'Pop Quiz', description: 'Short quiz for revision.', category: 'History', duration: 30, hidden: false },
];

const ExamListMock = () => {
    const [exams, setExams] = useState(mockExams);
    const [search, setSearch] = useState('');
    const [newExam, setNewExam] = useState({ title: '', description: '', category: '', duration: 0, hidden: false });
    const [editExam, setEditExam] = useState(null);
    const [modalShow, setModalShow] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const examsPerPage = 5;

    const handleCreateExam = () => {
        const newId = exams.length ? Math.max(...exams.map(e => e.id)) + 1 : 1;
        setExams([...exams, { ...newExam, id: newId }]);
        setNewExam({ title: '', description: '', category: '', duration: 0, hidden: false });
        setModalShow(false);
    };

    const handleUpdateExam = () => {
        setExams(exams.map(e => e.id === editExam.id ? editExam : e));
        setEditExam(null);
        setModalShow(false);
    };

    const handleDelete = (id) => {
        setExams(exams.filter(e => e.id !== id));
    };

    const toggleHide = (id) => {
        setExams(exams.map(e => e.id === id ? { ...e, hidden: !e.hidden } : e));
    };

    const filteredExams = exams.filter(e =>
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.description.toLowerCase().includes(search.toLowerCase())
    );

    const indexOfLast = currentPage * examsPerPage;
    const indexOfFirst = indexOfLast - examsPerPage;
    const currentExams = filteredExams.slice(indexOfFirst, indexOfLast);

    return (
        <Container className="mt-4">
            <h1 className="text-center mb-4 bg-primary text-white p-3 rounded">Exam List (Mock)</h1>

            <InputGroup className="mb-4 rounded">
                <Form.Control type="text" placeholder="Search exams" value={search} onChange={e => setSearch(e.target.value)} />
            </InputGroup>

            <div className="text-center mb-2">
                <ButtonGroup>
                    <Button variant="primary" onClick={() => setModalShow(true)} size="sm">Create New Exam</Button>
                </ButtonGroup>
            </div>

            <ListGroup className="mt-4">
                {currentExams.map(e => !e.hidden && (
                    <ListGroup.Item key={e.id} className="d-flex justify-content-between align-items-center mb-3 p-3 border rounded shadow-sm">
                        <Card className="w-100 border-0">
                            <Card.Body>
                                <h5 className="text-primary">{e.title}</h5>
                                <small className="text-muted">{e.category}</small>
                                <p>{e.description}</p>
                                <small>Duration: {e.duration} minutes</small>
                            </Card.Body>
                        </Card>
                        <div className="d-flex align-items-center">
                            <Button variant="info" size="sm" onClick={() => { setEditExam(e); setModalShow(true); }}>Edit</Button>
                            <Button variant="danger" size="sm" onClick={() => handleDelete(e.id)}>Delete</Button>
                            <Button variant="secondary" size="sm" onClick={() => toggleHide(e.id)}>
                                {e.hidden ? 'Show' : 'Hide'}
                            </Button>
                        </div>
                    </ListGroup.Item>
                ))}
            </ListGroup>

            <Pagination className="mt-4">
                {[...Array(Math.ceil(filteredExams.length / examsPerPage))].map((_, idx) => (
                    <Pagination.Item key={idx + 1} active={idx + 1 === currentPage} onClick={() => setCurrentPage(idx + 1)}>
                        {idx + 1}
                    </Pagination.Item>
                ))}
            </Pagination>

            {/* Modal */}
            <Modal show={modalShow} onHide={() => { setModalShow(false); setEditExam(null); }} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{editExam ? 'Edit Exam' : 'Create New Exam'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={editExam ? editExam.title : newExam.title}
                                onChange={(e) =>
                                    editExam
                                        ? setEditExam({ ...editExam, title: e.target.value })
                                        : setNewExam({ ...newExam, title: e.target.value })
                                }
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={editExam ? editExam.description : newExam.description}
                                onChange={(e) =>
                                    editExam
                                        ? setEditExam({ ...editExam, description: e.target.value })
                                        : setNewExam({ ...newExam, description: e.target.value })
                                }
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                type="text"
                                value={editExam ? editExam.category : newExam.category}
                                onChange={(e) =>
                                    editExam
                                        ? setEditExam({ ...editExam, category: e.target.value })
                                        : setNewExam({ ...newExam, category: e.target.value })
                                }
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Duration (minutes)</Form.Label>
                            <Form.Control
                                type="number"
                                value={editExam ? editExam.duration : newExam.duration}
                                onChange={(e) =>
                                    editExam
                                        ? setEditExam({ ...editExam, duration: e.target.value })
                                        : setNewExam({ ...newExam, duration: e.target.value })
                                }
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                label="Hidden"
                                checked={editExam ? editExam.hidden : newExam.hidden}
                                onChange={(e) =>
                                    editExam
                                        ? setEditExam({ ...editExam, hidden: e.target.checked })
                                        : setNewExam({ ...newExam, hidden: e.target.checked })
                                }
                            />
                        </Form.Group>

                        <Button variant="primary" onClick={editExam ? handleUpdateExam : handleCreateExam}>
                            {editExam ? 'Update Exam' : 'Create Exam'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default ExamListMock;
