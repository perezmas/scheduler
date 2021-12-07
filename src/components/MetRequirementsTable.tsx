import React from "react";
import { Table } from "react-bootstrap";

interface MetRequirementsTableProps {
    requirements: Array<string>;
    unmetRequirements: Array<string>;
}
const MetRequirementsTable = (
    props: MetRequirementsTableProps
): JSX.Element => {
    return (
        <div className="degree-requirements-wrapper">
            <div
                className="degree-requirements"
                data-testid="degree-requirements"
            >
                <Table>
                    <thead>
                        <tr>
                            <th>
                                Degree Requirements <br /> (Green = met, Red =
                                unmet)
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.requirements.map((requirement) => {
                            return (
                                <tr
                                    className={
                                        props.unmetRequirements.indexOf(
                                            requirement
                                        ) === -1
                                            ? "met"
                                            : "unmet"
                                    }
                                    key={requirement}
                                >
                                    <td>{requirement}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </div>
        </div>
    );
};

export default MetRequirementsTable;
