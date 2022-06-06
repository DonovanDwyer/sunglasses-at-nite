import { render, screen, fireEvent } from '@testing-library/react';
import InputContainer from './InputContainer';
import userEvent from '@testing-library/user-event';

describe('The Input Container component', () => {
    it('renders properly when given Input Field components as children', () => {
        const nameField = {
            label: 'Name',
            placeholder: 'Eren Yeager' 
        }
        const addressField = {
            label: 'Address',
            placeholder: '1261 Rosella Drive'
        }
        render(<InputContainer fields={[ nameField, addressField ]} />);
        expect(screen.getByText(/Name/)).toBeInTheDocument();
        expect(screen.getByText(/Address/)).toBeInTheDocument();
    });
    test('keeps track of any values input into child field components separately', async () => {
        const nameField = {
            label: 'Name',
            placeholder: 'Eren Yeager' 
        }
        const addressField = { label: 'Address' };
        render(<InputContainer fields={[ nameField, addressField ]} />);
        const textBoxes = screen.getAllByRole('textbox');
        await userEvent.type(textBoxes[0], 'Elon Musk');
        await userEvent.type(textBoxes[1], 'The Space X Mars Territorial Snowglobe');

        expect(screen.getByDisplayValue(/Elon Musk/)).toBeInTheDocument();
        expect(screen.getByDisplayValue(/The Space X Mars Territorial Snowglobe/)).toBeInTheDocument();
    });
    test('submits values currently input into child fields all at once when custom-named submit button is pressed', async () => {
        const nameField = { label: 'Name' };
        const addressField = { label: 'Address' };
        const submitHandler = jest.fn();
        render(<InputContainer fields={[ nameField, addressField ]} onSubmit={submitHandler} submitLabel={'Save'}/>);
        const textBoxes = screen.getAllByRole('textbox');
        await userEvent.type(textBoxes[0], 'Johnny Depp');
        await userEvent.type(textBoxes[1], 'The Land of Innocence');

        await fireEvent.submit(screen.getByTestId('form'));

        expect(screen.getByText(/Save/)).toBeInTheDocument();
        expect(submitHandler).toHaveBeenCalledTimes(1);
        expect(submitHandler.mock.calls).toContainEqual([{
            'Name': 'Johnny Depp',
            'Address': 'The Land of Innocence'
        }]);
    });
});