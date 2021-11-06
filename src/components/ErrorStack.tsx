import React from "react";
import { Problem } from "../hooks/useProblems";
import ReactDOM from "react-dom";

interface ErrorStackProps{
    problems: Array<Problem> | null;
}

export default function ErrorStack(props: ErrorStackProps): JSX.Element{
    if(props.problems !== null){
        const ctr = [<div className="error-counter" key={0}>
            {props.problems.length} {props.problems.length === 1 ? "error" : "errors"}
        </div>];
        return ReactDOM.createPortal(
            <div className="error-stack-container">
                <div className="error-stack">
                    {ctr.concat(props.problems.map((problem: Problem) => {
                        return (
                            <span className={problem.error ? "error" : "warning"} key={problem.uuid} data-testid={problem.error ? "error" : "warning"}>
                                {problem.message}
                            </span>
                        );
                    }))}
                </div>

            </div>,document.body);
    }else{
        return <span data-testid="no-errors"/>;
    }

}