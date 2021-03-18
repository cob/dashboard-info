/** @jest-environment node */
const { Instances } = require("../src/Instances")
const { auth, rmAddInstance, rmDeleteInstance } = require("@cob/rest-api-wrapper")

const sleep = function (t) {
    return new Promise (resolve => {
        setTimeout(() => resolve(),t)
    })
}

var Storage = require('dom-storage');
localStorage = new Storage('./db3.json', { strict: false, ws: '  ' });
beforeAll(() => {
    localStorage.clear()
}); 

test('new Instances sets def and query ', () => {
    const mockUpdateCb = jest.fn()
    adi = new Instances("Countries Series", mockUpdateCb, 1, "*", 10, "d1" )
    adi.stopUpdates();
    expect(adi.def).toBe("Countries Series")
    expect(adi.query).toBe("*")
})


test('if we add 3 instances that is what we should get',  (done) => {
    const mockUpdateCb = jest.fn() 
    
    return auth("jestTests", "1jestTests2")
    .then( () => {
        dc = new Instances("Test Person", mockUpdateCb, 1, "Instances_Test*", 3, "d3" )

        sleep(200).then( () => {
            expect(dc.getValue()).toEqual([])

            let p1,p2,p3
            rmAddInstance("Test Person", {"Name": "Instances_Test1"}).then( result => p1 = result )
            rmAddInstance("Test Person", {"Name": "Instances_Test2"}).then( result => p2 = result )
            rmAddInstance("Test Person", {"Name": "Instances_Test3"}).then( result => p3 = result )

            .then( result => {
                dc.forceRefresh()
                sleep(2100).then( () => {
                    values = dc.getValue()
                    
                    rmDeleteInstance(p1.id)
                    rmDeleteInstance(p2.id)
                    rmDeleteInstance(p3.id)
                    
                    expect(values.length).toBe(3)

                    expect(values[0].name[0]).toMatch(/Instances_Test[123]/)
                    expect(values[1].name[0]).toMatch(/Instances_Test[123]/)
                    expect(values[2].name[0]).toMatch(/Instances_Test[123]/)

                    sleep(1500).then( () => {
                        dc.stopUpdates()
                        done()
                    })
                })
                .catch( e => {
                    done(e)
                })
            })
        })
        .catch( e => {
            done(e)
        })
    })
    .catch( e => {
        done(e)
    })
})
