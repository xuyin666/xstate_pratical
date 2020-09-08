import { Machine, interpret } from 'xstate';


// It's an event!
const keyDownEvent = {
    type: 'keydown',
    key: 'Enter'
}

const lightMachine = Machine({
    /**/
});

const { initialState } = lightMachine;

let nextState = lightMachine.transition(initialState, 'TIMER');
console.log(nextState.value);

const mouseMachine = Machine({

})
const mouseService = interpret(mouseMachine).start()


window.addEventListener('mousemove', event => {
    mouseService.send(event);
});


const skipMachine = Machine({
    id: 'skip',
    initial: 'one',
    states: {
        one: {
            on: { CLICK: 'two'}
        },
        two: {
            on: { '': 'three'}
        },
        three: {
            type: 'final'
        }
    }
});

const { initialState } = skipMachine;
const nextState = skipMachine.transition(initialState, 'CLICK');

console.log(nextState.value);

const isAdult= ({age}) => age>=18;
const isMinor= ({age}) => age<18;


const ageMachine = Machine({
    id: 'age',
    context: { age: undefined},
    initial: 'unknown',
    states: {
        unknown: {
            on: {
                '': [
                    {target: 'adult', cond: isAdult},
                    {target: 'child', cond: isMinor}
                ]
            }
        },
        adult: {type: 'final'},
        child: {type: 'final'}
    }
})

console.log(ageMachine.initialState.value);

const personData = { age: 28};

const personMachine = ageMachine.withContext(personData);

console.log(personMachine.initialState.value);