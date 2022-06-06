import Category from './Category';

describe('Category class', () => {
    it('Successfully creates an instance of the Category class', () => {
        const category = new Category('Romance Movies from 1997');
        expect(category).toBeInstanceOf(Category);
    });

    it('Is instantiated with a name', () => {
        const category = new Category('Action Movies from the 1980s');
        expect(category.name).toMatch('Action Movies from the 1980s');
        expect(() => {
            new Category();
        }).toThrowError();
    });

    it('Accept categories as children', () => {
        const parentCategory = new Category('Animated Series');
        const childCategory = new Category('Anime');
        parentCategory.appendChild(childCategory);
        expect(parentCategory.children).toContain(childCategory);
        expect(parentCategory.children).toHaveLength(1);

        const secondChild = new Category('Cartoon Network Cartoons');
        const thirdChild = new Category('Nickelodeon Cartoons');
        const fourthChild = new Category('French Cartoons from 1970s');

        parentCategory.appendChild([secondChild, thirdChild, fourthChild]);
        expect(parentCategory.children).toHaveLength(4);
        expect(parentCategory.children).toContain(fourthChild);
    });

    it('Accepts objects as data', () => {
        const legalDocuments = new Category('Legal Documents');
        const taxDocument = { title: "Tax Document 2021", details: "NSA, Go Away" }

        legalDocuments.addData(taxDocument);
        expect(legalDocuments.data).toContain(taxDocument);

        const birthCertificate = { title: "Birth Certificate", firstName: "Thomas", lastName: "Hank" }
        const moreTaxDocuments = { title: "Tax Document 2022", details: "Stop spying on me" }
        const carRegistration = { tite: "Car Registration Form", model: "1995 Toyota Corolla" }
        legalDocuments.addData([birthCertificate, moreTaxDocuments, carRegistration]);
        expect(legalDocuments.data).toHaveLength(4);
        expect(legalDocuments.data).toContain(moreTaxDocuments);
    });

    it('Children category data persists after being added', () => {
        const fiction = new Category('Fiction eBooks');
        const horror = new Category('Horror eBooks');
        const cosmic = new Category('Cosmic Horror eBooks');
        const lovecraft = new Category('H.P. Lovecraft');
        const ebook = { title: "The Call of Cthulhu", author: "H.P. Lovecraft" }

        lovecraft.addData(ebook);
        cosmic.appendChild(lovecraft);
        horror.appendChild(cosmic);
        fiction.appendChild(horror);
        expect(fiction.children[0].children[0].children).toContain(lovecraft);
        expect(fiction.children[0].children[0].children[0].data).toContain(ebook);
    });

    it('Doesn\'t accept non-Category instances as children', () => {
        const category = new Category('Wedding Photos');
        const kitchenTable = { type: "Oak Wood", originCountry: "France" };

        expect(() => {
            category.appendChild(kitchenTable);
        }).toThrowError();
    });
});
