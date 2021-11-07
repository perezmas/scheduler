import { useReducer } from "react";

/**An error or warning within a form that the user is filling out.*/
export interface Problem{
    /**An identifier that allows removing problems later.*/
    uuid: string
    /**Whether or not this problem will stop the user from submitting the form.*/
    error: boolean,
    /**The message that is displayed to the user when this problem occurs. Also used internally to determine the cause of problems and find if they need to be removed.*/
    message: string

    source: string

    key: string
}

export function getByUUID<T extends Problem>(
    state: Array<T>,
    uuid: string
): number {
    for (let i = 0; i < state.length; i++) {
        if (state[i].uuid === uuid) {
            return i;
        }
    }
    return -1;
}

interface AbstractProblemAction{
    type: "RESOLVE-UUID" | "ADD" | "CLEAR" | "RESOLVE-KEY"
}

interface ResolveProblemAction extends AbstractProblemAction{
    type: "RESOLVE-UUID" | "RESOLVE-KEY",
    target: string
}

interface AddProblemAction extends AbstractProblemAction{
    type: "ADD",
    problem: Problem
}

interface ClearProblemAction extends AbstractProblemAction{
    type: "CLEAR",
    source: string,
}

function problemReducer(prev: Array<Problem>, action: AbstractProblemAction): Array<Problem>{
    const newState: Array<Problem> = prev.map((value: Problem) => {
        return {uuid: value.uuid, error: value.error, message: value.message, source: value.source, key: value.key};
    });
    switch(action.type){
    case "RESOLVE-UUID": {
        const realAction = action as ResolveProblemAction;
        const targetIndex = getByUUID(newState, realAction.target);
        if(targetIndex !== -1){
            newState.splice(targetIndex,1);
        }
        return newState;
    }case "RESOLVE-KEY": {
        const realAction = action as ResolveProblemAction;
        for(let i = 0; i < newState.length; i++){
            if(newState[i].key === realAction.target){
                newState.splice(i,1);
            }
        }
        return newState;
    }case "ADD": {
        const realAction = action as AddProblemAction;
        newState.push(realAction.problem);
        return newState;
    }case "CLEAR": {
        const realAction = action as ClearProblemAction;
        const output: Array<Problem> = new Array<Problem>();
        for(let i = 0;i < newState.length; i++){
            if(newState[i].source !== realAction.source){
                output.push(newState[i]);
            }
        }
        return output;
    }
    default:
        throw Error(`${action.type} not implemented!`);
    }
}

export function getByKey(problems: Array<Problem>, key: string): Problem | null{
    for(const problem of problems){
        if(problem.key === key){
            return problem;
        }
    }
    return null;
}

/**Contains a state object and some convenience functions that interact with it through reduceProblem.*/
interface ProblemsInterface{
    /**Contains the current problem and the backlog of problems. */
    value: Array<Problem>,
    /**Resolves the problem in the backlog with the uuid matching the target argument. */
    resolve: (target: string) => void,
    resolveByKey: (target: string) => void
    /**Adds a problem to the backlog. If current is empty, this will be put in the current field instead. Problems with error=true will be prioritized for the current field. */
    add: (problem: Problem) => void,
    /**Sets the current problem to null and empties the backlog. */
    clear: (source: string) => void
}

function initializer(): Array<Problem>{
    return new Array<Problem>();
}

export default function useProblems(): ProblemsInterface{
    const [output, dispatchOutput] = useReducer(problemReducer,undefined,initializer);

    const resolve = (target: string) => {
        const action: ResolveProblemAction = {type: "RESOLVE-UUID", target: target};
        dispatchOutput(action);
    };

    const resolveByKey = (target: string) => {
        const action: ResolveProblemAction = {type: "RESOLVE-KEY", target: target};
        dispatchOutput(action);
    };

    const add = (problem: Problem) => {
        const action: AddProblemAction = {type: "ADD", problem: problem};
        dispatchOutput(action);
    };

    const clear = (source: string) => {
        const action: ClearProblemAction = {type: "CLEAR", source: source};
        dispatchOutput(action);
    };

    return {add: add, resolve: resolve, resolveByKey: resolveByKey, clear: clear, value: output};


}