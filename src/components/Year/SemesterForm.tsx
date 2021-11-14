import React, { ChangeEvent, FormEvent } from "react";

interface SemesterFormProps{
    /**Whether or not this form can be submitted. */
    canSubmit: boolean,
    /**An event handler executed when the form is submitted. */
    handleSubmit: (e: FormEvent<HTMLFormElement>) => void,
    /**An event handler executed when an input field in the form is modified. */
    handleInput: (e:ChangeEvent<HTMLInputElement>) => void
}

/**A form that takes in all the data required to add a semester to a pre-existing Year component. */
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