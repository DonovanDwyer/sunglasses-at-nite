const FileSystemHandler = require('./FileSystemHandler');

describe('The File System Handler', () => {
    it('scans a particular directory recursively and pulls in all relevant files', () => {
        const path = '/Users/donovandwyer/Development/sunglasses-at-nite/electron/Test\ Data/Test\ Files';
        const fileSystem = new FileSystemHandler();
        fileSystem.setTypes(['all']);
        fileSystem.watch(path);
        expect(fileSystem.sync()).toHaveLength(14);
        expect(fileSystem.sync()).toEqual(expect.arrayContaining([
            {
                "metadata": {
                        "atime": new Date('2022-04-18T00:20:14.895Z'), 
                        "atimeMs": 1650241214894.5034, 
                        "birthtime": new Date('2022-02-20T02:07:43.722Z'), 
                        "birthtimeMs": 1645322863722.4712, 
                        "blksize": 4096, 
                        "blocks": 56, 
                        "ctime": new Date('2022-04-18T00:20:13.671Z'), 
                        "ctimeMs": 1650241213671.1692, 
                        "dev": 16777232, 
                        "gid": 20, 
                        "ino": 11259005, 
                        "mode": 33188, 
                        "mtime": new Date('2022-02-20T02:08:35.386Z'), 
                        "mtimeMs": 1645322915385.8416, 
                        "nlink": 1, 
                        "rdev": 0, 
                        "size": 26621, 
                        "uid": 501
                }, 
                "path": "/Users/donovandwyer/Development/sunglasses-at-nite/electron/Test Data/Test Files/images/Test.jpg"
            }, 
            {
                "metadata": {
                        "atime": new Date('2022-04-18T00:20:17.457Z'), 
                        "atimeMs": 1650241217457.1045, 
                        "birthtime": new Date('2022-02-19T19:37:56.097Z'), 
                        "birthtimeMs": 1645299476096.6248, 
                        "blksize": 4096, 
                        "blocks": 16, 
                        "ctime": new Date('2022-04-18T00:20:16.233Z'), 
                        "ctimeMs": 1650241216232.6304, 
                        "dev": 16777232, 
                        "gid": 20, 
                        "ino": 11258997, 
                        "mode": 33188, 
                        "mtime": new Date('2022-02-19T19:37:56.097Z'), 
                        "mtimeMs": 1645299476096.965, 
                        "nlink": 1, 
                        "rdev": 0, 
                        "size": 7299, 
                        "uid": 501
                }, 
                "path": "/Users/donovandwyer/Development/sunglasses-at-nite/electron/Test Data/Test Files/images/download (1).jpeg"
            }
          ]));
    });
    it('correctly assesses compatible file types by extension', () => {
        const path = '/Users/donovandwyer/Development/sunglasses-at-nite/electron/Test\ Data/Test\ Files';
        const fileSystem = new FileSystemHandler();
        fileSystem.setTypes(['videos']);
        fileSystem.watch(path);
        expect(fileSystem.sync()).toEqual(expect.arrayContaining([
            {
                "metadata": {
                    "atime": new Date('2022-02-18T03:07:53.221Z'), 
                    "atimeMs": 1645153673220.5735, 
                    "birthtime": new Date('2022-02-18T01:58:36.974Z'), 
                    "birthtimeMs": 1645149516974.2617, 
                    "blksize": 4096, 
                    "blocks": 41512, 
                    "ctime": new Date('2022-04-18T00:19:12.114Z'), 
                    "ctimeMs": 1650241152113.9167, 
                    "dev": 16777232, 
                    "gid": 20, 
                    "ino": 11258996, 
                    "mode": 33188, 
                    "mtime": new Date('2022-02-18T01:58:46.146Z'), 
                    "mtimeMs": 1645149526146.3438, 
                    "nlink": 1, 
                    "rdev": 0, 
                    "size": 21253765, 
                    "uid": 501
                },
                "path": "/Users/donovandwyer/Development/sunglasses-at-nite/electron/Test Data/Test Files/videos/DASH_1080.mp4"
            }
        ]));
        expect(fileSystem.sync()).toEqual(expect.not.arrayContaining([
            '/Users/donovandwyer/Development/sunglasses-at-nite/electron/Test Data/Test Files/images/.SomeSortOfHiddenFile'
        ]));
        expect(fileSystem.sync()).toEqual(expect.not.arrayContaining([
            '/Users/donovandwyer/Development/sunglasses-at-nite/electron/Test Data/Test Files/not_compatible_file.plrz'
        ]));
        expect(fileSystem.sync()).toEqual(expect.not.arrayContaining([
            '/Users/donovandwyer/Development/sunglasses-at-nite/electron/Test Data/Test Files/images/Test.jpg',
        ]));
        expect(fileSystem.sync()).toEqual(expect.not.arrayContaining([
            '/Users/donovandwyer/Development/sunglasses-at-nite/electron/Test Data/Test Files/text_file.txt'
        ]));
    });
    it('captures file data for all file types in relation to the iOS environment', () => {
        const metaTest = {
            "atime": new Date('2022-02-18T03:07:53.221Z'), 
            "atimeMs": 1645153673220.5735, 
            "birthtime": new Date('2022-02-18T01:58:36.974Z'), 
            "birthtimeMs": 1645149516974.2617, 
            "blksize": 4096, 
            "blocks": 41512, 
            "ctime": new Date('2022-04-18T00:19:12.114Z'), 
            "ctimeMs": 1650241152113.9167, 
            "dev": 16777232, 
            "gid": 20, 
            "ino": 11258996, 
            "mode": 33188, 
            "mtime": new Date('2022-02-18T01:58:46.146Z'), 
            "mtimeMs": 1645149526146.3438, 
            "nlink": 1, 
            "rdev": 0, 
            "size": 21253765, 
            "uid": 501
        };
        const path = '/Users/donovandwyer/Development/sunglasses-at-nite/electron/Test\ Data/Test\ Files';
        const fileSystem = new FileSystemHandler();
        fileSystem.setTypes(['videos']);
        fileSystem.watch(path);
        const files = fileSystem.sync();
        expect(fileSystem.metadata(files[0].path)).toMatchObject(metaTest);
    });
    test.todo('captures file data in relation to the Windows environment');
    test.todo('allows editing of metadata');
    it('opens a given file using the related native application', () => {
        
    });
});

describe('The thumbnail capturing functionality', () => {
    test.todo('allows for capturing thumbnails');
    test.todo('customizes as what timestamp thumbnails will be captured based upon percentage');
});

