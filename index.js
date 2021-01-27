

// this function allows play in Casino
function playGameFunc() {
    let numLucky = [];
    for (let i = 0; i <= 2; i++) {
        numLucky.push(Math.floor(Math.random()*(10 - 0)+0))
    }
    const getNumberOfDuplicateItems = arr => arr.length - [...new Set(arr)].length
    const Items = getNumberOfDuplicateItems(numLucky)
    if (Items === 2) {
        return {Result: 3}
    } else if (Items === 1) {
        return {Result: 2}
    } else {
        return {Result: false}
    }
}



class SuperAdmin {
    constructor(name, money) {
        this.name = name;
        this.money = money;
        this.casino = null;
    }

    createNewCasino(name) {
        this.casino = new Casino(name);
    }

    createOneNewGameMachine(id, startSumMoneyForGameMachine) {
        if (this.money >= startSumMoneyForGameMachine) {
            this.money -= startSumMoneyForGameMachine;
            this.casino.createGameMachine(id, startSumMoneyForGameMachine);
        } else {
            console.log("No!! You don't have the required amount of money");
        }
    }

    putMoneyToGameMachine(id, putMoney) {
        if(this.money >= putMoney){
            this.money -= putMoney;
            this.casino.putMoneyToGameMachineInCasino(id, putMoney);
        } else {
            console.log('Small budget of casino')
        }
    }

    deleteGameMachine(id) {
        this.casino.deleteGameMachineInCasino(id)
    }

    getMoneyFromAllMachine(sum){
        this.casino.getMoneyFromAllMachineInCasino(sum);
        this.money += sum;
    }

    playGameAsUser(num, numMachine){
        if(this.money >= num && numMachine){
            this.money -= num
            this.money = this.money + this.casino.playGameInGameMachine(num, numMachine)
        }else {
            console.error('Error!')
        }

    }


}

class Casino {
    constructor(name) {
        this.name = name;
        this.listOfGameMachines = [];
    }

    createGameMachine(id, getStartMoneyFromSuperAdmin) {
        this.listOfGameMachines.push(new GameMachine(id, getStartMoneyFromSuperAdmin))
    }

    get getMoney() {
        let sum = 0;
        this.listOfGameMachines.map(value => {
            return sum += value.getMoney
        })
    }

    get getMachineCount() {
        return this.listOfGameMachines.length;
    }

    putMoneyToGameMachineInCasino(id, money) {
        this.listOfGameMachines.map(value => {
            if (value.id === id) {
                value.sumMoneyOfMachine(money)
            } else {
                console.log("Id not found")
            }
        })
    }

    deleteGameMachineInCasino(id) {
        let index;
        this.listOfGameMachines.map(value => {
            if (value.id === id) {
                index = this.listOfGameMachines.indexOf(value);
            } else {
                console.log("Id not found")
            }
        })
        const sum = this.listOfGameMachines[index].money;
        this.listOfGameMachines.splice(index - 1, 1);
        for (let i = 0; i < this.listOfGameMachines.length; i++) {
            this.listOfGameMachines[i].sumMoneyOfMachine(sum / this.listOfGameMachines.length)
        }
    }

    getMoneyFromAllMachineInCasino(sum){
        let finallySum = 0;
        let sorted = this.listOfGameMachines.sort((a,b)=> b.money - a.money)
        sorted.forEach((element, index) => {
            if (element.money >= sum) {
                this.setSum(element.id, element.money - sum)
                sum = element.money - sum;
                return sum;
            } else {
                finallySum += sorted[index].money;
                this.setSum(element.id, 0)
            }
        })
        return finallySum;
    }

    setSum(id, money) {
        this.listOfGameMachines.forEach((element, index) => {
            if (element.id === id) {
                this.listOfGameMachines[index].money = money;
            }
        });
    }

    playGameInGameMachine(num, numMachine){
        let index = this.listOfGameMachines.map(el => el.id).indexOf(numMachine)
        if(index !== -1){
            if(this.listOfGameMachines[index].money > num){
                const result = this.listOfGameMachines[index].playGameMachine(num);
                console.log(this.listOfGameMachines)
                return result;
            }else{
                console.error('Error!')
            }
        }else{
            console.error('Machine not found')
        }

    }
}

class GameMachine {
    constructor(id, money) {
        this.id = id;
        this.money = money;
    }

    get getMoney() {
        return this.money;
    }

    sumMoneyOfMachine(money) {
        this.money += money;
    }

    playGameMachine(num){
        const valueGameMachine =  playGameFunc();
        if(valueGameMachine.Result){
            this.money -= num
            const winValue = num * valueGameMachine.Result
            console.info('You win')
            return winValue

        }else{
            this.sumMoneyOfMachine(num)
            console.error('You lose')
            return 0

        }

    }
}


class User {
    constructor(name, money) {
        this.name = name
        if(money>0){
            this.money = money
        }else {
            console.error("Forget about this place")

        }
    }
    playGameInUser(money, admin, machine){
        if(this.money > 0 && this.money >= money){
            this.money -= money
            this.money = this.money + admin.casino.playGameInGameMachine(money, machine)
            console.log(this.money)
        }else {
            console.error('Error!')

        }
    }

}

const admin = new SuperAdmin('Oleksii', 10000);
const user = new User ('Andrii', 2000)
admin.createNewCasino('Fortuna');
admin.createOneNewGameMachine(1, 1000);
admin.createOneNewGameMachine(2, 3000);
admin.createOneNewGameMachine(3, 2000);
admin.createOneNewGameMachine(4, 1000);
user.playGameInUser(500, admin, 1)
console.debug(admin.casino.listOfGameMachines)
console.debug(admin)
console.debug(admin.casino)


