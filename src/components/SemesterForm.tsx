import React, { ChangeEvent, FormEvent } from "react";

interface SemesterFormProps{
    canSubmit: boolean,
    handleSubmit: (e: FormEvent<HTMLFormElement>) => void,
    handleInput: (e:ChangeEvent<HTMLInputElement>) => void
}

export default function SemesterForm(props: SemesterFormProps): JSX.Element{
    return (
        <form
            onSubmit={props.handleSubmit}
        >
            <label>season:</label>
            <input
                data-testid="season-input"
                type="text"
                name="season"
                onChange={props.handleInput}
            />
            <br />
            <label>starts:</label>
            <input
                data-testid="starts-input"
                type="date"
                name="starts"
                onChange={props.handleInput}
            />
            <br />
            <label>ends:</label>
            <input
                data-testid="ends-input"
                type="date"
                name="ends"
                onChange={props.handleInput}
            />
            <br />
            <input
                disabled={!props.canSubmit}
                data-testid="submit-button"
                type="submit"
                value="submit"
            />
        </form>
    );
}
