import { render, screen, waitFor } from '@testing-library/react';
import { Video } from '../../Models/Video';
import userEvent from '@testing-library/user-event';
import FileList from './FileList';

let listOfVideos;
beforeAll(() => {
    listOfVideos = [
        {
            'id': 1001,
            'title': 'Todo List',
            'filepath': 'C:/Documents/todo_list_apr03.txt',
            'filesize': '15kb',
            'custom': 'Monday'
        },
        {
            'id': 1002,
            'title': 'The Regulators',
            'author': 'Richard Bachman',
            'filepath': 'C:/eBooks/novels/horror/Richard Bachman - The Regulators.mobi',
            'filesize': '51mb',
            'custom': 'Tuesday'
        },
        {
            'id': 1003,
            'title': 'Snowfall - S5 E8 - Celebration',
            'format': 'MP4',
            'filepath': 'C:/TV Shows/snowfall.s05e08.celebration.yify.mp4',
            'filesize': '407091mb',
            'duration': '0h 48m',
            'custom': 'Wednesday'
        }
    ];
    listOfVideos = listOfVideos.map((video) => new Video(video));
});

describe('The File List component', () => {
    it('renders without incident', () => {
        render(<FileList />);
    });
    it('displays a list of files when provided', () => {
        render(<FileList files={listOfVideos} />);
        expect(screen.getByText('The Regulators')).toBeInTheDocument();
        expect(screen.getByText('407091mb')).toBeInTheDocument();
        expect(screen.getByText('C:/Documents/todo_list_apr03.txt')).toBeInTheDocument();
    });
});

describe('File selection', () => {
    test('allows for the selection of a single file from the file list', async () => {
        render(<FileList files={listOfVideos} />);
        await userEvent.click(screen.getByText('Todo List'));
        expect(screen.getByText('Todo List')).toHaveClass('selected');
    });
    test.todo('allows for the selection of multiple files from the file list');
});

describe('File sorting lists files', () => {
    test('with data according to user-enabled fields', () => {
        render(<FileList files={listOfVideos} overrideDefaultColumns={['title', 'filepath', 'custom']} />);
        expect(screen.getByText('Monday')).toBeInTheDocument();
        expect(screen.getByText('Tuesday')).toBeInTheDocument();
        expect(screen.getByText('Wednesday')).toBeInTheDocument();
    });
    test.todo('alphabetically in ascending order');
    test.todo('alphabetically in decending order');
    test.todo('by pecified numerical metadata field in ascending order');
    test.todo('by specified numerical metadata filed in descending order');
    test.todo('by specified data-based metadata field in ascending order');
    test.todo('by specified data-based metadata field in descending order');
});