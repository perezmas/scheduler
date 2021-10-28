import React from "react";
import { /*Row, Col, CardGroup, Button,*/ Row,Col,Card, Button } from "react-bootstrap";
import "./styles.css";
import { Link } from "react-router-dom";

/*type PlansProps = {
    plan: any;
    setCurrentId: (id: number) => void;
};*/


export function Plans(): JSX.Element{
    //classes = useStyles();
    //const dispatch = useDispatch();
    return (
        <Row><Col xs={5} className="g-4"><Card className="card">
            <Card.Img variant="top" src="./placeholder-image.jpeg"></Card.Img>
            <Card.Body>
                <Card.Title className="title">Test Plan</Card.Title>
                <Card.Text>This is a test card</Card.Text></Card.Body><Link to="/Plan">
                <Button variant="primary" >
                        Go to plan</Button></Link><Card.Footer><small className="text-muted">Last updated x mins ago.</small></Card.Footer></Card></Col>
        <Col xs={5} className="g-4"><Card className="card">
            <Card.Img variant="top" src="./placeholder-image.jpeg"></Card.Img>
            <Card.Body>
                <Card.Title className="title">Test Plan</Card.Title>
                <Card.Text>This is a test card</Card.Text></Card.Body><Link to="/Plan">
                <Button variant="primary" >
                        Go to plan</Button></Link><Card.Footer><small className="text-muted">Last updated x mins ago.</small></Card.Footer></Card></Col></Row>
    );
}
export default Plans;