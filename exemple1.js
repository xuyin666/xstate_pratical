import { Machine } from 'xstate';

const lightMachine = Machine({

    // to identify the machine and set the base 
    // string for its child state node IDs 
    id: 'light',
    initial: 'green',

    // representer le local "extended state" for all of 
    // the machine's nested states 
    context: {
        elapsed: 0,
        direction: 'east'
    },

    states: {
        green: {},
        yellow: {},
        red: {}
    }
});

const lightMachine1 = Machine(
    {
        id: 'light',
        initial: 'green',

        context: {
            elapsed: 0,
            direction: 'east'
        },

        states: {
            green: { entry: 'alertGreen'},
            yellow: {},
            red: {},
        },
    },
    {
        //  the mapping of action names to their implementation 
        actions: {
            alertGreen: (context, event) => {
                alert('Green!');
            }
        },
        // the mapping of activity names to their implementation
        activities: {

        },
        // the mapping of transition guard(cond) names 
        //to their implementation
        
        guards: {

        },
        // the mapping of invoked service(src) names 
        //to their implementation
        services: {

        }
    },
    
);

const lightMachine2 = Machine({
    id: 'light',
    initial: 'green',

    context: {
        elapsed: 0,
        direction: 'east'
    },

    states: {
        green: {},
        yellow: {},
        red: {}
    }
});

const noAlertLightMachine = lightMachine.withConfig({
    actions: {
        alertGreen: (context, event) => {
            console.log('green');
        }
    }
})


// it will not merge of the original context,
// but it will replace the original context 
// with the context provided to . withContext(...)
const testLightMachine = lightMachine.withContext({
    elapsed: 1000,
    direction: 'north'
}); 