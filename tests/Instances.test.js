/** @jest-environment node */ //For auth
import instancesList from "../src/InstancesList.js"
import { auth, rmAddInstance, rmDeleteInstance } from "@cob/rest-api-wrapper"

const sleep = (t) => new Promise (resolve => setTimeout(() => resolve(),t))

test('if we add 3 instances that is what we should get',  async () => {
    var random = Math.floor(Math.random() * 1000)
    await auth({ username:"jestTests", password:"1jestTests2" })
    await instancesList({definitionName:"Test Person", query:"Instances_Test_"+random+"_*"})
    .then( results => {
        expect(results.value).toEqual([])
    })
    
    let p1,p2,p3
    await rmAddInstance("Test Person", {"Name": "Instances_Test_"+random+"_1"}).then( result => p1 = result )
    await rmAddInstance("Test Person", {"Name": "Instances_Test_"+random+"_2"}).then( result => p2 = result )
    await rmAddInstance("Test Person", {"Name": "Instances_Test_"+random+"_3"}).then( result => p3 = result )
    await sleep(800) // Wait for ES indexing

    await instancesList({definitionName:"Test Person", query:"Instances_Test_"+random+"*", size:10})
    .then( results => {
        let values = results.value
        expect(values.length).toBe(3)
        expect(values[0].name[0]).toMatch(/Instances_Test_\d*_[123]/)
        expect(values[1].name[0]).toMatch(/Instances_Test_\d*_[123]/)
        expect(values[2].name[0]).toMatch(/Instances_Test_\d*_[123]/)
    })
    .finally( () => {
        rmDeleteInstance(p1.id)
        rmDeleteInstance(p2.id)
        rmDeleteInstance(p3.id)
    })

})

test('Count of "countries series" for arab world in 2018-07-10 should be 4, if passed with timezone and 0 otherwise', async () => {

    const with_tz = await instancesList({definitionName:"Countries Series", query:"year.date:2018-07-10 Arab World", size:100, tz: "Europe/Lisbon"} )
    expect(with_tz.value.length).toBe(4)

    const without_tz = await instancesList({definitionName:"Countries Series", query:"year.date:2018-07-10 Arab World", size:100} )
    expect(without_tz.value.length).toBe(0)

})


