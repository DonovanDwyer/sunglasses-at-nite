import { Metadata, MetadataField } from "./Metadata";

describe('The Metadata Field model', () => {
    it('successfully creates an instance of the Metadata Field class', () => {
        const metadataField = new MetadataField('Title', 'Goldeneye');
        expect(metadataField).toBeInstanceOf(MetadataField);
        expect(metadataField.field).toMatch('Title');
        expect(metadataField.value).toMatch('Goldeneye');
    });
});

describe('The Metadata model', () => {
    it('successfully creates an instance of the Metadata class', () => {
        const metadata = new Metadata();
        expect(metadata).toBeInstanceOf(Metadata);
    });
    it('collects metadata fields', () => {
        const metadata = new Metadata();
        metadata.addNew('Duration', '1h 48m');

        expect(metadata.value('Duration')).toMatch('1h 48m');

        const title = new MetadataField('Title', 'Back to the Future II');
        
        metadata.add(title);
        expect(metadata.byField('Title')).toBeInstanceOf(MetadataField);

        const filesize = new MetadataField('File Size', '4.5 gb');
        const filepath = new MetadataField('File Path', 'C:/movies/Back_To_The_Future_2_(1989).mp4');
        metadata.add([filesize, filepath]);
        expect(metadata.getAll()).toHaveLength(4);
        expect(metadata.value('File Size')).toMatch('4.5 gb');
    });
    it('Retrieves metadata fields on request', () => {
        const bookMetadata = new Metadata();
        const title = new MetadataField('Title', 'The Regulators');
        const author = new MetadataField('Author', 'Richard Bachman');
        const pageNumber = new MetadataField('Number of Pages', 480);
        const format = new MetadataField('Format', 'epub');

        bookMetadata.add([ title, author, pageNumber, format ]);
        expect(bookMetadata.byField('Title')).toBeInstanceOf(MetadataField);
        expect(bookMetadata.byField('Author')).toBe(author);
        expect(bookMetadata.byValue('epub')).toBe(format);
        expect(bookMetadata.value('Number of Pages')).toEqual(480);
    });
});