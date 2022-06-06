import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import  InputField from './InputField';

describe('The Input Field component', () => {
    test('properly renders', () => {
        render(<InputField label={'Name'} />);
        expect(screen.getByText(/Name/)).toBeInTheDocument();
    });
    test('sends along inputted values to handler function', async () => {
        const onChange = jest.fn();

        render(<InputField label={ 'Name' } onChange={ onChange } />);
        await userEvent.type(screen.getByRole('textbox'), 'Eren Yeager');

        expect(onChange).toHaveBeenCalledTimes(11);
        expect(screen.getByDisplayValue(/Eren Yeager/)).toBeInTheDocument();
    });
    test('accepts optional placeholder value', () => {
        render(<InputField label={ 'Name' } placeholder={ 'Nunia Bisnez' } />);
        expect(screen.getByPlaceholderText(/Nunia Bisnez/)).toBeInTheDocument();
    });
})