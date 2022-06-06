import Tag from './Tag';

describe('The Tag model', () => {
    it('successfully creates an instance of a Tag', () => {
        const tag = new Tag('Noir');
        expect(tag).toBeInstanceOf(Tag);
    });

    it('is instantiated with a name', () => {
        const tag = new Tag('Nighttime Photo');
        expect(tag.name).toMatch('Nighttime Photo');
        expect(() => {
            new Tag();
        }).toThrowError();
    });

    it('can be successfully applied to items', () => {
        const nsfwTag = new Tag('NSFW');
        const video = { title: 'Car Accident Footage', tags: [] };

        nsfwTag.applyTo(video);
        expect(nsfwTag.associations).toContain(video);

        const ebook = { title: 'Anarchist\'s Cookbook', tags: [] };
        const photo = { title: 'Images from World War II', tags: [] };
        nsfwTag.applyTo([ebook,photo]);
        expect(nsfwTag.associations).toContain(photo);
        expect(nsfwTag.associations).toHaveLength(3);
    });

    test.todo('aligns tag instances with Tag table in database');
    test.todo('saves tag instance to row in database');
    test.todo('updates tag instance if prompted');
    test.todo('saves updates to Tag table in database if prompted');
    test.todo('queries for tags in database');
    test.todo('find all files associated with a particular tag in database');
    test.todo('keep track of associated files in tag instance at all times and update immediately when needed');
    test.todo('removes tag associations immediately when prompted');
    test.todo('prevent duplicate file associations from being created');
    test.todo('get all tags from database');
    test.todo('prevents duplicate tags from being created');
    test.todo('deletes a tag from database when prompted');
});