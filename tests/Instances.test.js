/** @jest-environment node */
const { Instances } = require("../src/Instances")
const { auth, rmAddInstance, rmDeleteInstance } = require("@cob/rest-api-wrapper")

const sleep = function (t) {
    return new Promise (resolve => {
        setTimeout(() => resolve(),t)
    })
}


test('if we add 3 instances that is what we should get',  (done) => {
    const mockUpdateCb = jest.fn() 
    localStorage.removeItem("anonymous-c3_Value")
    
    return auth("jestTests", "1jestTests2")
    .then( () => {
        dc = new Instances("c3","Test Person", "Instances_Test*", 1, mockUpdateCb )

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
                    .catch( e => {
                        done(e)
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
        .catch( e => {
            done(e)
        })
    })
    .catch( e => {
        done(e)
    })
})
