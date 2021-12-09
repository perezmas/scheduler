import React from "react";
import {
    Button,
    Card,
    Col,
    Container,
    Row,
    Dropdown,
    ButtonGroup,
} from "react-bootstrap";
import "./styles.css";
import { Link } from "react-router-dom";
import { v4 as uuid } from "uuid";
import PlanData from "../interfaces/Plan";
import { Plans } from "../hooks/usePlans";

interface PlanPageProps {
    plans: Plans;
}

/**A card on the home screen that lets the user move between schedulers, mainly so that advisors can keep track of their students. */
export function PlanPage(props: PlanPageProps): JSX.Element {
    const { plans } = props;

    const addPlan = () => {
        // adds plan with new unique id
        plans.addPlan(uuid());
    };

    const deleteCard = (planItem: PlanData) => {
        // asks if you want to delete plan and deletes it
        if (window.confirm("Are you sure you want to delete this plan?")) {
            plans.deletePlan(planItem.uuid);
        }
    };

    const copy = (planItem: PlanData) => {
        // makes copy of given plan
        plans.copyPlan(planItem.uuid, planItem);
    };

    const renderCard = (planItem: PlanData) => {
        localStorage.setItem("Plans Array", JSON.stringify(plans));
        return (
            <Card
                className="plan-card flex-row"
                style={{
                    alignItems: "center",
                    justifyContent: "space-evenly",
                    height: "100%",
                }}
            >
                <Card.Body style={{ flex: "0 1 auto" }}>
                    <Card.Title>Plan #{planItem.id} </Card.Title>
                    <Card.Text
                        style={{ fontWeight: "lighter", fontSize: "0.85rem" }}
                    >
                        {planItem.date}
                    </Card.Text>
                </Card.Body>
                <Dropdown as={ButtonGroup}>
                    <Button
                        as={Link}
                        to={`Plans/${planItem.uuid}`}
                        variant="success"
                        data-testid="edit-plan"
                    >
                        Edit Plan
                    </Button>

                    <Dropdown.Toggle
                        split
                        variant="success"
                        id="dropdown-split-basic"
                        data-testid="plan-toggle"
                    />

                    <Dropdown.Menu>
                        <Dropdown.Item
                            onClick={() => {
                                copy(planItem);
                            }}
                            data-testid="copy-plan"
                        >
                            Duplicate Plan
                        </Dropdown.Item>
                        <Dropdown.Item
                            style={{ color: "#DC3E45" }}
                            color="white"
                            onClick={() => {
                                deleteCard(planItem);
                            }}
                            data-testid="delete-plan"
                        >
                            Remove Plan
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Card>
        );
    };
    return (
        <Container>
            <Row xs={1} md={3} className="g-4">
                {plans.planList.map((planItem: PlanData) => 
                    <Col key={planItem.uuid}>{renderCard(planItem)}</Col>
                )}
                <Col>
                    <Card
                        bg="light"
                        className="add-plan-card"
                        style={{ height: "100%" }}
                    >
                        <Button
                            id="add-plan-button"
                            data-testid="add-plan"
                            onClick={addPlan}
                        >
                            Add a plan <br />{" "}
                            <span id="add-plan-icon"> + </span>
                        </Button>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default PlanPage;
