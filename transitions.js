import { Machine, interpret } from 'xstate';
import { assign } from 'xstate/lib/actionTypes';

const promiseMachine = Machine({
    id: 'promise',
    initial: 'pending',
    states: {
        pending: {
            on: {
                RESOLVE: 'resolved',

                REJECT: {
                    target: 'rejected'
                }
            }
        },
        resolved: {
            type: 'final'
        },
        rejected: {
            type: 'final'
        }
    }
});

const { initialState } = promiseMachine;

console.log(initialState.value);

const nextState = promiseMachine.transition(initialState, 'RESOLVE');

console.log(nextState.value);


const wizardMachine = Machine({
    id: 'wizard',
    initial: 'open',
    states: {
        open: {
            initial: 'step1',
            states: {
                step1: {
                    on: { NEXT: 'step2'}
                },
                step2: {

                },
                step3: {

                }
            },
            on: {
                NEXT: 'goodbye',
                CLOSE: 'closed'
            }
        },
        goodbye: {
            on: { CLOSE: 'closed' }
        },
        closed: {type: 'final'}
    }
});

const { initialState } = wizardMachine;

const nextStepState = wizardMachine.transition(initialState, 'NEXT');
console.log(nextStepState.value)

const closedState = wizardMachine.transition(initialState, 'CLOSE');
console.log(closedState.value);



const wordMachine = Machine({
    id: 'word',
    initial: 'left',
    states: {
        left: {},
        right: {},
        center: {},
        justify: {}
    },
    on: {
        LEFT_CLICK: '.left',
        RIGHT_CLICK: { target: '.right'},
        CENTER_CLICK: {target: '.center', internal: true },
        JUSTIFY_CLICK: {target: 'justify', internal: true}

    }
});


const gameMachine = Machine(
    {
        id: 'game',
        initial: 'playing',
        context: {
            points: 0
        },
        states: {
            playing: {
                on: {
                    '': [
                        {target: 'win', cond: 'didPlayerWin'},
                        {target: 'lose', cond: 'didPlayerLose'}
                    ],
                    AWARD_POINTS : {
                        actions: assign({
                            points: 100
                        })
                    }
                }
            },
            win: {type: 'final'},
            lose: {type: 'final'}
        }
    },
    {
        guards: {
            didPlayerWin: (context, event) => {
                return context.points > 99;
            },
            didPlayerLose: (context, event) => {
                return context.points < 0;
            }
        }
    }
);

const gameService = interpret(gameMachine)
    .onTransition((state) => console.log(state.value))
    .start();

gameService.send('AWARD_POINTS');

const formMachine = Machine({
    id: 'form',
    initial: 'firstPage',
    states: {
        firstPage: {
            /*..*/
        },
        secondPage: {
            /* ... */ 
        },
        userInfoPage: {
            on: {
                LOG: undefined
            }
        }
    },
    on: {
        LOG: {
            actions: 'logTelemetry'
        }
    }
});


const settingsMachine = Machine({
    id: 'settings',
    type: 'parallel',
    states: {
        mode: {
            initial: 'active',
            states: {
                inactive: {},
                pending: {},
                active: {}
            }
        },
        status: {
            initial: 'enabled',
            states: {
                disabled: {},
                enabled: {}
            }
        }
    },
    on: {
        DEACTIVATE: {
            target: ['.mode.inactive', '.status.disabled']
        }
    }
});