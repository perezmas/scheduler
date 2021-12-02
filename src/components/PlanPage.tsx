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

interface PlanPageProps {
    plans: PlanProps[];
    setPlans: (plans: PlanProps[]) => void;
}

/**A card on the home screen that lets the user move between schedulers, mainly so that advisors can keep track of their students. */
export function PlanPage(props: PlanPageProps): JSX.Element {
    const { plans, setPlans } = props;

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
                                deleteCard(plans, planItem);
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
                {plans.map((planItem) => 
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
