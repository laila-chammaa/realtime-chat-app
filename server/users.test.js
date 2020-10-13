const { addUser, users, removeUser, getUser, getUsersInRoom } = require("./users.js");
const puppeteer = require("puppeteer");

//emptying users array every time we start testing
test('users array should be empty' , () => {
    users.splice(0,users.length);
    expect(users).toMatchObject([]);
});

describe("Adding Users", () => {
    test('should add user to users array #1 (normal version)', () => {
        addUser({id:"12345", name:"laila", room:"comp371"});
        expect(users).toMatchObject([{ id:"12345", name:"laila", room:"comp371" }]);
    }),
    test('should add user to users array #2 (same user, extra spaces)', () => {
        expect(addUser({id:"22345", name:"    Laila", room:"   cOmp371   "})).toMatchObject({"user": {id:"223455", name:"laila.4", room:"comp371"}});
        expect(users).toMatchObject([{ id:"12345", name:"laila", room:"comp371" },{ id:"223455", name:"laila.4", room:"comp371" }]);
    }),
    test('emptying users array', () => {
        // just removing these test users from users array
        users.splice(0,users.length);
        expect(users).toMatchObject([]);
    }),
    test('should add user to users array #3 (empty name and room)', () => {
        expect(addUser({id:"125245", name:null, room:"comp371"})).toMatchObject({"error": "Username and room are required."});
        expect(addUser({id:"125245", name:"", room:"null"})).toMatchObject({"error": "Username and room are required."});
    })
});

users.splice(0,users.length);

describe("Removing Users", () => {
    test('should remove user from users array #1', () => {
        addUser({id:"12345", name:"laila", room:"comp371"});
        expect(removeUser("12345")).toMatchObject({id:"12345", name:"laila", room:"comp371"});
        expect(users).toMatchObject([]);
    }),
    test('should remove user from users array #2 no id', () => {
        expect(removeUser("12345")).toBeNull();
        expect(removeUser(null)).toBeNull();
    })
});

users.splice(0,users.length);

describe("Getting Users", () => {
    test('getting user by id #1', () => {
        addUser({id:"12345", name:"farah", room:"hello"});
        expect(getUser("12345")).toMatchObject({id:"12345", name:"farah", room:"hello"});
    })
    test('getting user by id #2', () => {
        expect(getUser("hello")).toBeUndefined();
    })
    test('getting users in room', () => {
        addUser({id:"12345", name:"farah", room:"general"});
        addUser({id:"12346", name:"laila", room:"general"});
        addUser({id:"12347", name:"salma", room:"general"});
        addUser({id:"12348", name:"sawsan", room:"general"});
        expect(getUsersInRoom("general")).toMatchObject([{id:"12345", name:"farah", room:"general"}, {id:"12346", name:"laila", room:"general"}, {id:"12347", name:"salma", room:"general"}, {id:"12348", name:"sawsan", room:"general"}]);
    })
});

users.splice(0,users.length);

//e2e tests!!
test('should enter 2 users into a room', async () => {
    users.splice(0,users.length);
    const browser = await puppeteer.launch({
        headless: true,
        // slowMo: 10,
        // args: ["--window-size=1920,1080"]
    });

    //starting user1
    const page = await browser.newPage();
    await page.goto("http://127.0.0.1:3000");
    await page.click("input.joinInput");
    await page.type("input.joinInput", "sawsan");
    await page.click("input.joinInput.mt-20");
    await page.type("input.joinInput.mt-20", "comp371");
    await page.click("button.button.mt-20");

    await page.waitForTimeout(4000);

    //checking if admin welcome message is sent
    var adminText = await page.$eval("div.messageBox.backgroundLight", (el) => el.textContent);
    expect(adminText).toBe("sawsan, welcome to the room comp371.");

    //starting user2
    const page2 = await browser.newPage();
    await page2.goto("http://127.0.0.1:3000");
    await page2.click("input.joinInput");
    await page2.type("input.joinInput", "laila");
    await page2.click("input.joinInput.mt-20");
    await page2.type("input.joinInput.mt-20", "comp371");
    await page2.click("button.button.mt-20");

    await page.waitForTimeout(4000);

    //checking if admin welcome message is sent
    adminText = await page2.$eval("div.messageBox.backgroundLight", (el) => el.textContent);
    expect(adminText).toBe("laila, welcome to the room comp371.");

    //--------------------------------------

    //checking if admin laila joined message is sent
    await page.waitForTimeout(4000);

    adminText = await page.evaluate(() => Array.from(document.querySelectorAll("div.messageBox"), element => element.textContent));
    expect(adminText[1]).toBe("laila has joined.");

    //checking if user1 is already in the room (UI)
    var online = await page.evaluate(() => Array.from(document.querySelectorAll(".activeItem"), element => element.textContent));
    expect(online[0]).toBe("sawsan");
    expect(online[1]).toBe("laila");
    
    //user1 sending a text hello
    await page.click("input.input");
    await page.type("input.input", "hi, laila!!");
    await page.click("button.sendButton");

    //checking if text is sent
    var text = await page.$eval("p.messageText.colorWhite", (el) => el.textContent);
    expect(text).toBe("hi, laila!!");

    //checking if text is received
    text = await page.evaluate(() => Array.from(document.querySelectorAll("p.messageText"), element => element.textContent));
    expect(text[2]).toBe("hi, laila!!");
    
    await page.close();
    await page2.close();
    await browser.close();
}, 50000);

test('users array should be empty' , () => {
    users.splice(0,users.length);
    expect(users).toMatchObject([]);
});