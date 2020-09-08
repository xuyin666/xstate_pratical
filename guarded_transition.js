const { assign } = require("xstate/lib/actionTypes");
const { interpret } = require("xstate");

const searchValid = (context, event) => {
    return context.canSearch && event.query && event.query.length > 0;
};

const searchMachine = Machine(
    {
        id: 'search',
        initial: 'idle',
        context: {
            canSearch: true
        },
        states: {
            idle: {
                on: {
                    SEARCH: [
                        {
                            target: 'searching',
                            cond: searchValid
                        },
                        { target: '.invalid'}
                    ]
                },
                initial: 'normal',
                states: {
                    normal: {},
                    invalid: {}
                }
            },
            searching: {
                entry: 'executeSearch'
            },
            searchError: {

            }
        }
    },
    {
        guards: {
            searchValid
        }
    }
)

const searchMachine = Machine(
    {
        //...
        states: {
            idle: {
                on: {
                    SEARCH: {
                        target: 'searching',
                        cond: 'searchValid'

                    }
                }
            }
        }
    },
    {
        guards: {
            searchValid: (context, event) => {
                return context.canSearch && event.query && event.query.length >0;
            }
        }
    }
);



const doorMachine = Machine(
    {
        id: 'door',
        initial: 'closed',
        context: {
            level: 'user',
            alert: false
        },
        states: {
            closed: {
                initial: 'idle',
                states: {
                    idle: {},
                    error: {}
                },
                on: {
                    SET_ADMIN: {
                        actions: assign({level: 'admin'})
                    },
                    SET_ALARM: {
                        actions: assign({alert: true})
                    },
                    OPEN: [
                        { target: 'opened', cond:'isAdmin'},
                        { target: '.error', cond: 'shouldAlert'},
                        { target: '.idle'}
                    ]
                }
            },
            opened: {
                on : {
                    CLOSE: 'closed'
                }
            }
        }
    },
    {
        guards: {
            isAdmin: (context) => context.level === 'admin',
            shouldAlert: (context) => context.alert === true
        }
    }
)

const doorService = interpret(doorMachine)
    .onTransition((state) => console.log(state.value))
    .start();

doorService.send('OPEN');

doorService.send('SET_ALARM');

doorService.send('OPEN');

doorService.send('SET_ADMIN');

doorService.send('OPEN');



const lightMachine = Machine ({
    id: 'light',
    initial: 'green',
    states: {
        green: { on: {TIMER: 'yellow'}},
        yellow: { on: {TIMER: 'red'}},
        red: {
            initial: 'walk',
            states: {
                walk: {},
                wait: {},
                stop: {}
            }
        },
        on: {
            TIMER: [
                {
                    target: 'green',
                    in: '#light.red.stop'
                }
            ]
        }
    }
});