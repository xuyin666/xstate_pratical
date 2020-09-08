const { send, spawn, interpret } = require("xstate");
const { assign } = require("xstate/lib/actionTypes");
const { raise, respond, forwardTo, escalate } = require("xstate/lib/actions");

const triggerMachine = Machine ({
    id: 'trigger',
    initial: 'inactive',
    states: {
        inactive: {
            on : {
                TRIGGER: {
                    target: 'active',
                    actions: ['activate', 'sendTelemetry']
                }
            }
        },
        active: {
            entry: ['notifyActive', 'sendTelemetry'],
            exit: ['notifyInactive', 'sendTelemetry'],
            on: {
                STOP: 'inactive'
            }
        }
    }
},{
    actions: {
        activate: (context, event) => {
            console.log('activating...');
        },
        notifyActive: (context, event) => {
            console.log('active!');
        },
        notifyInactive: (context, event) => {
            console.log('inactive!');
        },
        sendTelemetry: (context,event) => {
            console.log('tiem:', Date.now());
        }

    }
});



const lazyStubbornMachine = Machine({
    id: 'stubborn',
    initial: 'inactive',
    states: {
        inactive: {
            on: {
                TOGGLE: {
                    target: 'active',
                    actions: send('TOGGLE')
                }
            }
        },
        active: {
            on: {
                TOGGLE: 'inactive'
            }
        }
    }
});

const nextState = lazyStubbornMachine.transition('inactive','TOGGLE');

nextState.value;

nextState.actions;



const sendName = send((context, event) => ({
    type: 'NAME',
    name: context.user.name
}));

const machine = Machine({
    // ...
    on: {
        TOGGLE: {
            actions: sendName
        }
    }
    // ...
});

// entry: assign({
//     someActor: () => {
//         const name = 'some-actor-name';

//         return {
//             name,
//             ref: spawn(someMachine, name);
//         }
//     }
// })

// {
//     actions: send('SOME_EVENT', {
//         to: context => context.someActor.name
//     })
// }

// {
//     actions: send('SOME_EVENT', {
//         to: context => context.someActor.ref
//     })
// }




const stubbornMachine = Machine({
    id: 'stubborn',
    initial: 'inactive',
    states: {
        inactive: {
            on: {
                TOGGLE: {
                    target: 'active',
                    actions: raise('TOGGLE')
                }
            }
        },
        active: {
            on: {
                TOGGLE: 'inactive'
            }
        }
    }
});

const nextState = stubbornMachine.transition('inactive', 'TOGGLE');

nextState.value;
nextState.actions;


const authServerMachine = Machine({
    initial: 'waitingForCode',
    states: {
        waitingForCode: {
            on: {
                CODE: {
                    actions: respond('TOKEN', {delay: 10})
                }
            }
        }
    }
});

const authClientMachine = Machine({
    initial: 'idle',
    states: {
        idle: {
            on: { AUTH: 'authorizing' }
        },
        authorizing: {
            invoke: {
                id: 'auth-server',
                src: authServerMachine
            },
            entry: send('CODE', {to: 'auth-server'}),
            on: {
                TOKEN: 'authorized'
            }
        },
        authorized: {
            type: 'final'
        }
    }
});


function alertService(_, receive) {
    receive((event) => {
        if(event.type === 'ALERT') {
            alert(event.message);
        }
    });
}

const parentMachine = Machine({
    id: 'parent',
    invoke: {
        id: 'alerter',
        src: ()=> alertService
    },
    on: {
        ALERT: { actions: forwardTo('alerter')}
    }
});

const parentService = interpret(parentMachine).start();

parentService.send('ALERT', {message: 'hello world'});


const childMachine = createMachine({

    entry: escalate({ message: 'This is some error'})
});

const parentMachine = createMachine({
    invoke: {
        src: childMachine,
        onError: {
            actions: (context, event) => {
                console.log(event.data);
            }
        }
    }
});


const loggingMachine = Machine({
    id: 'logging',
    context: {count: 42},
    initial: 'start',
    states: {
        start: {
            entry: log('started!'),
            on: {
                FINISH: {
                    target: 'end',
                    actions: log(
                        (context, event) => `count: ${context.count}, event: ${event.type}`,
                        'Finish label'
                    )
                }
            }
        },
        end: {}
    }
});

const endState = loggingMachine.transition('start','FINISH');

endState.actions;



const maybeDoThese = choose([
    {
        cond: 'cond1',
        actions: [
            log('cond1 chosen!')
        ]
    },
    {
        cond: 'cond2',
        actions: [
            log((context, event) => {}),
            log('another action')
        ]
    },
    {
        cond: (context, event) =>{
            return false;
        },
        actions: [
            (context, event) => {

            }
        ]
    },
    {
        actions: [
            log('fall-through action')
        ]
    }
]);



const counterMachine = Machine({
    id: 'counter',
    initial: 'counting',
    states: {
        counting: {
            entry: 'enterCounting',
            exit: 'exitCounting',
            on: {
                INC: {actions: 'increment'},
                DEC: { target: 'counting', actions: 'decrement'},
                DO_NOTHING: {internal: true, actions: 'logNothing'}
            }
        }
    }
});

const stateA = counterMachine.transition('counting', 'DEC');
stateA.actions;

const stateB = counterMachine.transition('counting', 'DO_NOTHING');
stateB.actions;

const stateC = counterMachine.transition('counting','INC');
stateC.actions;