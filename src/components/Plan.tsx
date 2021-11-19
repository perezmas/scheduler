import React, { useState } from "react";
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
import PlanProps from "../interfaces/Plan";
import { YearProps } from "../interfaces/Year";

export const testList: PlanProps[] = [
    {
        uuid: "1",
        id: 1,
        name: "max",
        date: "01/01/2021",
        years: Array<YearProps>(),
    },
    {
        uuid: "2",
        id: 2,
        name: "amani",
        date: "02/02/2021",
        years: Array<YearProps>(),
    },
];

/**A card on the home screen that lets the user move between schedulers, mainly so that advisors can keep track of their students. */
export function Plan(props: PlanProps): JSX.Element {
    const [plans, setPlans] = useState<Array<PlanProps>>([]);
    const addPlan = () => {
        // sets array of all cards
        setPlans([
            ...plans,
            {
                id: plans.length,
                uuid: uuid(),
                name: "",
                date: new Date().toLocaleDateString(),
                years: Array<YearProps>(),
            },
        ]);
        const index = plans.length;
        console.log("index: ", index);
        const arr: typeof props[] = [];

        // if empty array of plans

        if (index <= 0) {
            arr.push(plans[0]);
        }

        // if first item in array, set value of index 0
        if (index === 1) {
            arr.push(plans[0]);
        }
        if (index > 1) {
            arr.push(plans[index - 1]);
        }
    };

    const deleteCard = (oldArray: typeof plans, planItem: PlanProps) => {
        if (window.confirm("Are you sure you want to delete this plan?")) {
            const newArray = [...plans];
            const index = newArray.indexOf(planItem);

            if (index !== -1) {
                newArray.splice(index, 1);
                setPlans(newArray);
            }
        }
    };

    const copy = (planItem: PlanProps) => {
        // sets array of all cards
        setPlans([
            ...plans,
            {
                id: planItem.id,
                uuid: uuid(),
                name: planItem.name,
                date: planItem.date,
                years: planItem.years,
            },
        ]);
        const index = plans.length;
        console.log("index: ", index);
    };

    const renderCard = (planItem: PlanProps) => {
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
                    {/* 
                    <Link to={`Plans/${planItem.uuid}`}>
                        <button>Edit Plan</button>
                    </Link>
                    
                    <Button
                        onClick={() => {
                            console.log("button pressed");
                            deleteCard(plans, planItem);
                        }}
                    >
                        -
                    </Button>
                    <Button
                        onClick={() => {
                            copy(planItem);
                        }}
                    >
                        Duplicate Plan
                    </Button> */}
                </Card.Body>
                <Dropdown as={ButtonGroup}>
                    <Button
                        as={Link}
                        to={`Plans/${planItem.uuid}`}
                        variant="success"
                    >
                        Edit Plan
                    </Button>

                    <Dropdown.Toggle
                        split
                        variant="success"
                        id="dropdown-split-basic"
                    />

                    <Dropdown.Menu>
                        <Dropdown.Item
                            onClick={() => {
                                copy(planItem);
                            }}
                        >
                            Duplicate Plan
                        </Dropdown.Item>
                        <Dropdown.Item
                            style={{ color: "#DC3E45" }}
                            color="white"
                            onClick={() => {
                                deleteCard(plans, planItem);
                            }}
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
                {plans.map((planItem) => (
                    <Col key={planItem.uuid}>{renderCard(planItem)}</Col>
                ))}
                <Col>
                    <Card
                        bg="light"
                        className="add-plan-card"
                        style={{ height: "100%" }}
                    >
                        <Button id="add-plan-button" onClick={addPlan}>
                            Add a plan <br />{" "}
                            <span id="add-plan-icon"> + </span>
                        </Button>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Plan;
