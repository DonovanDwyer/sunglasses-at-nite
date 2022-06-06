import { render, screen } from '@testing-library/react';
import { Tag } from '../../Models/Tag';
import { Video } from '../../Models/Video';
import DetailPane from './DetailPane';

describe('The Detail Pane component', () => {
    it('renders without issue', () => {
        render(<DetailPane />);
    });
    it('shows a list of metadata when provided a file instance', () => {
        const snowfall = {
            'title': 'Snowfall - S5 E8 - Celebration',
            'format': 'MP4',
            'filepath': 'C:/TV Shows/snowfall.s05e08.celebration.yify.mp4',
            'filesize': '407091mb',
            'duration': '0h 48m'
        };
        const file = new Video(snowfall);

        render(<DetailPane file={file} />);
        expect(screen.getByText(/Snowfall - S5 E8 - Celebration/)).toBeInTheDocument();
        expect(screen.getByText(/MP4/)).toBeInTheDocument();
        expect(screen.getByText(/C:\/TV Shows\/snowfall\.s05e08\.celebration\.yify\.mp4/)).toBeInTheDocument();
        expect(screen.getByText(/407091mb/)).toBeInTheDocument();
        expect(screen.getByText(/0h 48m/)).toBeInTheDocument();
    });
    it('autocapitalizes field names', () => {
        const regulators = {
            'title': 'The Regulators',
            'author': 'Richard Bachman',
            'file path': 'C:/eBooks/novels/horror/Richard Bachman - The Regulators.mobi',
            'file size': '51mb',
            'here is a field that is pretty annoying': 'lookit'
        };
        const file = new Video(regulators);

        render(<DetailPane file={file} />);
        expect(screen.getByText(/Title/)).toBeInTheDocument();
        expect(screen.getByText(/Author/)).toBeInTheDocument();
        expect(screen.getByText(/File Path/)).toBeInTheDocument();
        expect(screen.getByText(/File Size/)).toBeInTheDocument();
        expect(screen.getByText(/Here is a Field that is Pretty Annoying/)).toBeInTheDocument();
    });
    it('shows list of associated tags when provided a file instance', () => {
        const rickAndMorty = {
            'id': 123456,
            'title': 'Rick and Morty - Season 1 - Episode 3 - Anatomy Park',
            'filepath': 'C:/tv shows/rick and morty/rick.and.morty.s01e03.anatomy.park.avi',
            'format': 'AVI',
            'height': 1080,
            'width': 1920
        };
        const video = new Video(rickAndMorty);

        const tag1 = new Tag('Animated');
        const tag2 = new Tag('NSFW');
        const tag3 = new Tag('Time Travel');

        video.applyTag([tag1, tag2, tag3]);
        render(<DetailPane file={video} />);
        expect(screen.getByText(/Tags/)).toBeInTheDocument();
        expect(screen.getByText(/Animated/)).toBeInTheDocument();
        expect(screen.getByText(/NSFW/)).toBeInTheDocument();
        expect(screen.getByText(/Time Travel/)).toBeInTheDocument();
    });
    test.todo('allows editing of metadata');
    test.todo('allows editing of tags');
    test.todo('provides autocomplete tag and field names when creating new ones');
});