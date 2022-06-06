import Video from './Video';
import { Metadata, MetadataField } from '../Metadata';

describe('The Video model', () => {

    it('successfully creates an instance of the Video class', () => {
        const video = new Video();
        expect(video).toBeInstanceOf(Video);
    });

    it('accepts and retrieves metadata', () => {
        const episode = new Video();
        episode.add('TV Show Title', 'The X-Files');
        episode.add('Episode Name', 'The War of the Coprophages');
        episode.add('Season Number', 3);
        episode.add('Episode Number', 12);
        expect(episode.metadata.getAll()).toHaveLength(4);
        expect(episode.metadata.byField('Episode Number')).toBeInstanceOf(MetadataField);
        expect(episode.metadata.value('Episode Name')).toMatch('The War of the Coprophages');
    });

    it('takes video data as a parameter and uses it to generate metadata', () => {
        const rickAndMorty = {
            'id': 123456,
            'title': 'Rick and Morty - Season 1 - Episode 3 - Anatomy Park',
            'filepath': 'C:/tv shows/rick and morty/rick.and.morty.s01e03.anatomy.park.avi',
            'format': 'AVI',
            'height': 1080,
            'width': 1920
        };
        const video = new Video(rickAndMorty);
        expect(video).toBeInstanceOf(Video);
        expect(video.metadata.byField('title')).toBeInstanceOf(MetadataField);
        const filepath = new MetadataField('filepath', 'C:/tv shows/rick and morty/rick.and.morty.s01e03.anatomy.park.avi');
        expect(video.metadata.byField('filepath')).toEqual(filepath);
    });

    test.todo('saves updates to data to video model instance');
    test.todo('aligns video instances with rows in Video table in database');
    test.todo('saves video to new row in Video table');
    test.todo('saves current state of video model to database when prompted');
    test.todo('updates video row based upon state of associated video instance');
    test.todo('finds row from Video table in database based on query and creates video instance from result');
    test.todo('get all video rows from video table at once');
    test.todo('deletes specified row from table when prompted');
});