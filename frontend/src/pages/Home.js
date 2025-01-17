import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container } from "react-bootstrap";

const Home = () => {
    const navigate = useNavigate();

    return (
        <Container className="text-center mt-5">
            <h1>Welcome to the Temporary Home Page</h1>
            <p>This is a placeholder for testing frontend purposes.</p>
            <Button
                variant="primary"
                onClick={() => navigate("/login")}
                className="m-2"
            >
                Go to Login
            </Button>
            <Button
                variant="primary"
                onClick={() => navigate("/questionlist")}
                className="m-2"
            >
                Go to Question List
            </Button>
        </Container>
    );
};

export default Home;
