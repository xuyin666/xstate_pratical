const fetchMachine = Machine({
    id: 'fetch',

    initial: 'idle',
    
    states: {
        idle: {
            on: {
                FETCH: 'pending'
            }
        },

        pending: {
            on: {
                FULFILL: 'success',
                REJECT: 'failure' 
            }
        },

        success: {
            initial: 'items',

            states: {
                items: {
                    on: {
                        'ITEM.CLICK': 'item'
                    }
                },
                item: {
                    on: {
                        BACK: 'items'
                    }
                }
            }
        },

        failure: {
            on: {
                RETRY: 'pending'
            }
        },
    }
});


const machine = Machine({
    id: 'fetch',
    initial: 'idle',
    states: {
        idle: {
            type: 'atomic',
            on: {
                FETCH: 'pending'
            }
        },
        pending: {
            type: 'parallel',
            states: {
                resource1: {
                    type: 'compound',
                    initial: 'pending',
                    states: {
                        pending: {
                            on: {
                            'FULFILL.resource1': 'success'
                            }
                        },
                        success: {
                            type: 'final'
                        }
                    }
                },
                resource2 : {
                    type: 'compound',
                    initial: 'pending',
                    states: {
                        pending: {
                            on: {
                                'FULFILL.resource2': 'success'
                            }
                        },
                        success: {
                            type: 'final'
                        }
                    }
                },
                onDone: 'success'
            }

        },
        success: {
            type: 'compound',
            initial: 'items',
            states: {
                items: {
                    on: {
                        'ITEM.CLICK': 'item'
                    }
                },
                item: {
                    on: {
                        BACK: 'item'
                    }
                },
                hist: {
                    type: 'history',
                    history: 'shallow'
                }
            } 
        }
    }
});







const timeOfDayMachine = Machine({
    id: 'timeOfDay',
    initial: 'unknown',
    context: {
        time: undefined
    },
    states: {
        unknown: {
            on: {
                '': [
                    {target: 'morning', cond: 'isBeforeNoon'},
                    {target: 'afternoon', cond: 'isBeforeSix'},
                    {target: 'evening'}
                ]
            }
        },

        morning: {},
        afternoon: {},
        evening: {}
    }
}, {
    guards: {
        isBeforeNoon: {},
        isBeforeSix: {}
    }
});


const timeOfDayService = interpret(timeOfDayMachine)
    .withContext({time: Date.now()})
    .onTransition(state => console.log(state.value))
    .start();



const fetchMachine = Machine({
    id: 'fetch',
    initial: 'idle',
    states: {
        idle: {
            on: { FETCH: 'loading'}
        },
        loading: {
            after: {
                3000: 'faiure.timeout'
            },
            on: {
                RESOLVE: 'success',
                REJECT: 'failure',
                TIMEOUT: 'failure.timeout'
            },
            meta: {
                message: 'Loading...'
            }
        },
        success: {
            meta: {
                message: 'The request succeeded!'
            }
        },
        failure: {
            initial: 'rejection',
            states: {
                rejection: {
                    meta: {
                        message: 'The request failed.'
                    }
                },
                timeout: {
                    meta: {
                        message: 'The request timed out.'
                    }
                }
            },
            meta: {
                alert: 'Uh no.'
            }
        }
    }
});