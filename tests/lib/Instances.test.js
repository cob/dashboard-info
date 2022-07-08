/** @jest-environment node */                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                //For auth
import instancesList from "src/lib/InstancesList.js"
import {auth, rmAddInstance, rmDeleteInstance} from "@cob/rest-api-wrapper"
import retry from "tests/utils/Retry.js"

test('if we add 3 instances that is what we should get', async () => {
    const random = Math.floor(Math.random() * 1000)
    await auth({username: "jestTests", password: "1jestTests2"})
    await instancesList({definitionName: "Test Person", query: "Instances_Test_" + random + "_*"})
        .then(results => {
            expect(results.value).toEqual([])
        })

    let p1, p2, p3
    
    await rmAddInstance("Test Person", {"Name": "Instances_Test_" + random + "_1"}).then(result => p1 = result)
    await rmAddInstance("Test Person", {"Name": "Instances_Test_" + random + "_2"}).then(result => p2 = result)
    await rmAddInstance("Test Person", {"Name": "Instances_Test_" + random + "_3"}).then(result => p3 = result)

    const success = await retry(10, 1000 /*1s*/, async () => {
        const results = await instancesList({definitionName: "Test Person", query: "Instances_Test_" + random + "*", size: 10})
        const values = results.value
        try {
            expect(values).toHaveLength(3)
            expect(values[0].name[0]).toMatch(/Instances_Test_\d*_[123]/)
            expect(values[1].name[0]).toMatch(/Instances_Test_\d*_[123]/)
            expect(values[2].name[0]).toMatch(/Instances_Test_\d*_[123]/)

            return true
        } catch(e){
            return false
        }
    })

    expect(success).toStrictEqual(true)
    
    await rmDeleteInstance(p1.id)
    await rmDeleteInstance(p2.id)
    await rmDeleteInstance(p3.id)
})
