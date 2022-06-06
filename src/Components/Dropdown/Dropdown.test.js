import Dropdown from './Dropdown';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('The Dropdown component', () => {
    test('properly renders', () => {
        render(<Dropdown/>);
        expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
    test('displays a list of options', () => {
        render(<Dropdown options={[ 'test1', 'test2' ]}/>);
        expect(screen.getAllByRole('option')[0]).toBeInTheDocument();
        expect(screen.getAllByRole('option')[1]).toBeInTheDocument();
    });
    test('shows the currently selected item', async () => {
        render(<Dropdown options={[ 'test1', 'test2' ]}/>);
        await userEvent.selectOptions(screen.getByRole('combobox'), 'test2');
        expect(screen.getByRole('option', {name: 'test2'}).selected).toBe(true);
    });
    test('can render with a default selected value', () => {
        render(<Dropdown options={[ 'Sonic', 'Tails' ]} defaultOption={'Select your hero'} />);
        expect(screen.getByText('Select your hero'));
    });
    test('submits the current selection when submit button is clicked', async () => {
        const submitHandler = jest.fn();
        render(<Dropdown 
            options={[ 'Sonic', 'Tails' ]} 
            defaultOptions={'Select your hero'} 
            submitLabel={'Save'} 
            submitHandler={submitHandler} 
            />);
        await userEvent.selectOptions(screen.getByRole('combobox'), 'Sonic');
        expect(screen.getByText('Save')).toBeInTheDocument();
        await userEvent.click(screen.getByText('Save'));
        expect(submitHandler).toBeCalledWith('Sonic');
    });
});