import { useState, useEffect } from 'react';
import {
    Share, StyleSheet, SafeAreaView, View, TextInput, Text, FlatList, TouchableOpacity, Alert, Modal, Button, Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';             //Icon 라이브러리
import AsyncStorage from '@react-native-async-storage/async-storage';   //비동기적 저장소, 앱이 꺼져도 데이터가 유지되는 장점
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Progress from 'react-native-progress';
let DATE = new Date()
const COLORS = { primary: '#1f145c', white: '#fff' };

//*🚩TodoApp View*//
const TodoApp = () => {
    const [todos, setTodos] = useState([]);
    const [textInput, setTextInput] = useState('');
    const [Total, setTotal] = useState(0);
    const [Complete, setComplete] = useState(0);
    const [todoid, setTodoid] = useState(null);
    const [ligthmode, setLightmode] = useState(true);
    const [view, setview] = useState(false);
    const [progress, setProgress] = useState(0);

    //*♻️render functions*//
    useEffect(() => {
        getTodosFromUserDevice();
    }, []);

    useEffect(() => {
        saveTodoToUserDevice(todos);
        getCompleted()
        getTotal()
    }, [todos]);

    //*🔗functions*//
    //addTodo function: 사용자가 입력한 할일을 입력받는 함수
    const addTodo = () => {
        if (textInput == '') {
            Alert.alert('Error', 'Please input todo');
        } else {
            const newTodo = {
                id: Math.random(),      //할일마다 랜덤으로 id 지정
                task: textInput,        //할일
                completed: false,       //할일 완료 여부
            };
            setTodos([...todos, newTodo]);
            setTextInput('');
        }
    };

    //saveTodoToUserDevice function: AsyncStorage에 할일을 저장하는 함수
    const saveTodoToUserDevice = async todos => {
        try {
            const stringifyTodos = JSON.stringify(todos);
            await AsyncStorage.setItem('todos', stringifyTodos);
        } catch (error) {
            console.log(error);
        }
    };

    //getTodosFromUserDevice function: AsyncStorage에서 할일을 가져오는 함수
    const getTodosFromUserDevice = async () => {
        try {
            const todos = await AsyncStorage.getItem('todos');
            if (todos != null) {
                setTodos(JSON.parse(todos));
            }
        } catch (error) {
            console.log(error);
        }
    };

    //markTodocomplete function: 할일 완료 기능을 수행하는 함수
    const markTodoComplete = todoId => {
        const newTodosItem = todos.map(item => {
            if (item.id == todoId) {
                return { ...item, completed: true };
            }
            return item;
        });

        setTodos(newTodosItem);
    };

    //TodocompleteCancel function: 할일 완료를 취소하는 함수
    const TodoCompleteCancel = todoId => {
        const newTodosItem = todos.map(item => {
            if (item.id == todoId) {
                return { ...item, completed: false };
            }
            return item;
        });

        setTodos(newTodosItem);
    };

    //TodocompleteCancel function: 할일 완료를 취소하는 함수
    const getTotal = () => {
        let Total = 0;
        const newTodosItem = todos.map(item => {
            Total++;
        });

        console.log(Total)
        setTotal(Total)
    };

    const getCompleted = () => {
        let Completed = 0;
        const newTodosItem = todos.map(item => {
            if (item.completed == true) {
                Completed++;
            }
        });

        console.log(Completed)
        setComplete(Completed)
    };

    //deleteTodo function: 하나의 TodoList를 삭제하는 함수
    const deleteTodo = todoId => {
        const newTodosItem = todos.filter(item => item.id != todoId);
        setTodos(newTodosItem);
    };

    //clearAllTodos function: 전체 TodoList를 삭제하는 함수
    const clearAllTodos = () => {
        Alert.alert('Confirm', 'Clear todos?', [
            {
                text: 'Yes',
                onPress: () => setTodos([]),
            },
            {
                text: 'No',
            },
        ]);
    };


    //*♾️components*//
    //ListItem component: 사용자가 할일을 입력하면 화면에 추가되는 컴포넌트
    const ListItem = ({ todo }) => {
        return (
            <>
                <TouchableOpacity style={styles.listItem}>
                    {!todo?.completed && (                                                   //'completed = false' 일때
                        <TouchableOpacity onPress={() => markTodoComplete(todo.id)}>
                            <View style={[styles.actionIcon, { backgroundColor: '#CCF2F4' }]}>
                                <Icon name="check-box-outline-blank" size={30} color="white" />
                            </View>
                        </TouchableOpacity>
                    )}
                    {todo?.completed && (                                                     //'completed = true' 일때
                        <TouchableOpacity onPress={() => TodoCompleteCancel(todo.id)}>
                            <View style={[styles.actionIcon, { backgroundColor: '#CCF2F4' }]}>
                                <Icon name="check-box" size={30} color="white" />
                            </View>
                        </TouchableOpacity>
                    )}
                    <View style={{ flex: 1, justifyContent: 'center', }}>
                        <Text
                            style={{
                                fontWeight: 'bold',
                                fontSize: 17,
                                color: todo?.completed ? '#AAAAAA' : COLORS.primary,
                                textDecorationLine: todo?.completed ? 'line-through' : 'none',
                                marginLeft: 10,
                            }}>
                            {todo?.task}
                        </Text>
                    </View>
                    <TouchableOpacity onPress={() => deleteTodo(todo.id)}>
                        <View style={[styles.actionIcon, { backgroundColor: '#CCF2F4' }]}>
                            <Icon name="remove-circle" size={30} color="white" />
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </>
        );
    };


    //*🖼️Screen View*//
    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: ligthmode ? '#F4F9F9' : 'black',
            }}>
            <View style={{
                padding: 20,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: ligthmode ? 'white' : '#222222'
            }}>
                <Text
                    style={{
                        fontWeight: 'bold',
                        fontSize: 20,
                        color: ligthmode ? COLORS.primary : 'white',
                    }}>
                    {DATE.getFullYear()}년 {DATE.getMonth() + 1}월 {DATE.getDate()}일
                </Text>
                <Icon name="drag-indicator" size={25} color="#158f9d" onPress={() => { setview(!view); console.log(view) }} />
            </View>
            {view &&
                <View
                    style={{
                        flexDirection: 'row',
                        margin: 15,
                        justifyContent: 'center',
                        alignItems: 'stretch',
                        height: 40
                    }}>
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            borderRadius: 25,
                            backgroundColor: '#CCF2F4',
                            justifyContent: 'center'
                        }}
                        onPress={() => { Share.share({ message: `${todos.map((item) => { return (item.task) })}` }) }}>
                        <Text style={{ textAlign: 'center', fontSize: 18, color:'#158f9d' }}>Share Lists</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            borderRadius: 25,
                            backgroundColor: '#CCF2F4',
                            justifyContent: 'center',
                            marginLeft: 10,
                        }}
                        onPress={() => { setLightmode(!ligthmode) }}>
                        <Text style={{ textAlign: 'center', fontSize: 18, color:'#158f9d'  }}>Ligth Mode</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            borderRadius: 25,
                            backgroundColor: '#CCF2F4',
                            justifyContent: 'center',
                            marginLeft: 10,
                        }}
                        onPress={clearAllTodos}>
                        <Text style={{ textAlign: 'center', fontSize: 18, color:'#158f9d'  }}>Delete All</Text>
                    </TouchableOpacity>
                </View>}
            <View style={{ flexDirection: 'row', alignItems: 'center', width: 600, marginTop: 20 }}>
                <Progress.Bar style={{ flex: 1, marginLeft: 30 }} progress={Total===0 ? 0 : Complete/Total} width={300} height={15} color={'#A4EBF3'} />
                <Text style={{ flex: 1, marginLeft: 10, fontSize: 15, fontWeight: '700', color: ligthmode ? COLORS.primary : 'white' }}>{Complete}/{Total}</Text>
            </View>
            <FlatList                                                             //*FlatList*//
                showsVerticalScrollIndicator={false}                                    //스크롤 숨기기
                contentContainerStyle={{ padding: 20, paddingBottom: 100 }}             //자식들 스타일
                data={todos}                                                            //리스트의 source를 담는 prop
                renderItem={({ item }) => <ListItem todo={item} />}                     //data로 받은 source 각각을 render시켜주는 콜백함수
            />

            <View style={styles.footer}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={{ fontSize: 23 }}
                        value={textInput}
                        placeholder="Add Todo"
                        onChangeText={text => setTextInput(text)}
                    />
                </View>
                <TouchableOpacity onPress={addTodo}>
                    <View style={styles.iconContainer}>
                        <Icon name="add" color="white" size={30} />
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

//*✨style sheet*//
const styles = StyleSheet.create({
    footer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: COLORS.white,
    },
    inputContainer: {
        height: 50,
        paddingHorizontal: 20,
        elevation: 40,
        backgroundColor: COLORS.white,
        flex: 1,
        marginVertical: 20,
        marginRight: 20,
        borderRadius: 30,
    },
    iconContainer: {
        height: 50,
        width: 50,
        backgroundColor: '#158f9d',
        elevation: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    listItem: {
        padding: 10,
        backgroundColor: '#CCF2F4',
        flexDirection: 'row',
        justifyContent: 'center',
        elevation: 12,
        borderRadius: 7,
        marginVertical: 5,
    },
    actionIcon: {
        height: 30,
        width: 30,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
        marginLeft: 5,
        borderRadius: 3,
    },
});

export default TodoApp;