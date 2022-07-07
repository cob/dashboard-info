/** @jest-environment node */                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                //For auth
import instancesList from "../../src/lib/InstancesList.js"
import {auth, rmAddInstance, rmDeleteInstance} from "@cob/rest-api-wrapper"
import sleep from "../../src/utils/Sleep.js";

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

    await sleep(1000) // Wait for ES indexing

    await instancesList({definitionName: "Test Person", query: "Instances_Test_" + random + "*", size: 10})
        .then(results => {
            const values = results.value
            expect(values).toHaveLength(3)
            expect(values[0].name[0]).toMatch(/Instances_Test_\d*_[123]/)
            expect(values[1].name[0]).toMatch(/Instances_Test_\d*_[123]/)
            expect(values[2].name[0]).toMatch(/Instances_Test_\d*_[123]/)
        })

    await rmDeleteInstance(p1.id)
    await rmDeleteInstance(p2.id)
    await rmDeleteInstance(p3.id)
})
