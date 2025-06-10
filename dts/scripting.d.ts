// =============================
// ⚠️【自動型別補強區塊】⚠️
// 本區塊由系統自動補強 Scriptable/Scripting App 型別，請勿重複宣告、刪除或修改本區塊內容。
// 若需擴充型別，請於本區塊下方新增，並避免與本區塊型別名稱重複。
// =============================

// ControlSize
export type ControlSize = 'mini' | 'small' | 'regular' | 'large';

// ChartAxisScaleType
export type ChartAxisScaleType = 'linear' | 'log' | 'category' | 'dateTime';

// ChartSymbolShape
export type ChartSymbolShape = 'circle' | 'square' | 'triangle' | 'diamond' | 'star' | 'cross' | 'plus';

// AxisSet 僅保留一份
type AxisSet = 'vertical' | 'horizontal' | 'all';

// ChartSelection
export type ChartSelection = number | string | Date | [number, number] | [string, string] | [Date, Date];

// ChartScrollPosition
export interface ChartScrollPosition<T = number | string | Date> {
    value: T;
    onChange?: (value: T) => void;
}

// SwingAnimation
export interface SwingAnimation {
    duration: number; // 秒
    distance: number; // px
}

// ClockHandRotationEffectPeriod
export type ClockHandRotationEffectPeriod = 'hourHand' | 'minuteHand' | 'secondHand' | number;

// ToolbarPlacement
export type ToolbarPlacement = 'automatic' | 'bottomBar' | 'navigationBar' | 'tabBar';

// SymbolRenderingMode
export type SymbolRenderingMode = 'monochrome' | 'hierarchical' | 'palette' | 'multicolor';

// SymbolVariants
export type SymbolVariants = 'none' | 'fill' | 'circle' | 'square' | 'slash';

// SymbolEffect
export type SymbolEffect = 'pulse' | 'bounce' | 'variableColor' | 'appear' | 'disappear';

// PresentationAdaptation
export type PresentationAdaptation = 'automatic' | 'fullScreen' | 'sheet' | 'popover';

// PresentationDetent
export type PresentationDetent = 'medium' | 'large' | { custom: number };

// PresentationBackgroundInteraction
export type PresentationBackgroundInteraction = 'automatic' | 'enabled' | 'disabled';

// PresentationContentInteraction
export type PresentationContentInteraction = 'automatic' | 'scrolls' | 'resizes';

// ContentTransition
export type ContentTransition = 'identity' | 'slide' | 'move' | 'opacity' | 'scale';

// BadgeProminence
export type BadgeProminence = 'standard' | 'increased';

// Prominence
export type Prominence = 'standard' | 'increased';

// NavigationSplitViewStyle
export type NavigationSplitViewStyle = 'automatic' | 'balanced' | 'prominentDetail' | 'doubleColumn';

// 已自動補強型別結束 =============================

/**
 * scripting v1.1.1
 * Copyright (c) 2024-present Thom Fang <tilfon@live.com>
 * All rights reserved.
 */

type IdProps = {
    /**
     * Use a unique key for a widget.
     */
    key?: string | number;
};
type InternalWidgetRender<P = {}> = (props: P) => RenderNode;
type RenderNode = {
    isInternal: boolean;
    type?: string;
    id?: string;
    props?: any;
} & IdProps;
type ComponentProps<T = {}> = T & IdProps & {
    children?: VirtualNode | string | number | boolean | undefined | null | Array<string | number | boolean | undefined | null | VirtualNode>;
};
type VirtualNode = IdProps & {
    isInternal: boolean;
    props: ComponentProps<any>;
    render: FunctionComponent<any> | InternalWidgetRender;
};
type FunctionComponent<P = {}> = (props: P) => VirtualNode;
type SetStateAction<S> = S | ((preState: S) => S);
type StateInitializer<S> = () => S;
type EffectDestructor = () => void;
type EffectSetup = () => EffectDestructor | void | undefined;
type ComponentEffect = [any[], EffectSetup, boolean, ReturnType<EffectSetup>];
type ComponentEffectEvent<T extends any[], R> = (...args: T) => R;
type ComponentCallback<T extends Function> = [T, any[]];
type ComponentMemo = [any, any[]];
type Reducer<S, A> = (preState: S, action: A) => S;
type ReducerState<R extends Reducer<any, any>> = R extends Reducer<infer S, any> ? S : never;
type ReducerAction<R extends Reducer<any, any>> = R extends Reducer<any, infer A> ? A : never;
type Dispatch<A> = (action: A) => void;

/**
 * An adaptive background view that provides a standard appearance based on the the widget’s environment.
 */
declare const AccessoryWidgetBackground: FunctionComponent<{}>;

/**
 * `useCallback` is a React Hook that lets you cache a function definition between re-renders.
 *  You can’t call it inside loops or conditions. If you need that, extract a new component and move the state into it.
 *
 *
 * @example
 * ```tsx
 * function App() {
 *   const [count, setCount] = useState(0)
 *   const onButtonClicked = useCallback(() => {
 *     setCount(count => count + 1)
 *   }, [])
 *
 *   return (
 *     <VStack>
 *       <Text>{count}</Text>
 *       <MyButton
 *         onClick={onButtonClicked}
 *       />
 *     </VStack>
 *   )
 * }
 *
 * // This component would not render any more after first render.
 * function MyButton({onClick}: {onClick: () => void}) {
 *   return (
 *     <Button title="Click" action={onClick} />
 *   )
 * }
 * ```
 */
declare function useCallback<T extends Function>(func: T, deps: any[]): T;

type ProviderProps<T> = {
    value: T;
    children: VirtualNode;
};
type ConsumerProps<T> = {
    children: (value: T) => VirtualNode;
};
type Provider<T> = (props: ProviderProps<T>) => VirtualNode;
type Consumer<T> = (props: ConsumerProps<T>) => VirtualNode;
/**
 * Passing Data Deeply with Context.
 */
type Context<T> = {
    readonly id: number;
    readonly Provider: Provider<T>;
    readonly Consumer: Consumer<T>;
    debugLabel?: string;
};
/**
 * Create a data context.
 *
 * @returns `Context` object
 *
 * @example
 * ```tsx
 * import { Color, createContext, Navigation, useColorScheme } from 'scripting'
 *
 * type ThemeData = {
 *   labelColor: Color
 * }
 * const lightTheme: ThemeData = {
 *   labelColor: '#000000'
 * }
 * const darkTheme: ThemeData = {
 *   labelColor: '#FFFFFF'
 * }
 *
 * const ThemeDataContext = createContext<ThemeData>()
 *
 * function ThemeDataProvider({
 *   children
 * }: {
 *   children: JSX.Element
 * }) {
 *   const colorScheme = useColorScheme()
 *   const themeData = colorScheme == 'dark' ? darkTheme : lightTheme
 *
 *   return (
 *     <ThemeDataContext.Provider value={themeData}>
 *       {children}
 *     </ThemeDataContext.Provider>
 *   )
 * }
 *
 * function View() {
 *   const theme = useContext(ThemeDataContext)
 *
 *   return <Text color={theme.labelColor}>Hello world!</Text>
 * }
 *
 * Navigation.present({
 *   element: (
 *     <ThemeDataProvider>
 *       <View />
 *     </ThemeDataProvider>
 *   )
 * })
 * ```
 */
declare function createContext<T>(): Context<T>;

/**
 * `useContext` is a Hook that lets you read and subscribe to context from your component.
 *
 * @example
 * ```tsx
 * const MyContext = createContext<{
 *   value: string
 * }>()
 *
 * function Provider({children}: {children: JSX.Element}) {
 *   return (
 *     <MyContext.Provider value={{
 *       value: 'some value here'
 *     }}>
 *     {children}
 *     </MyContext.Provider>
 *   )
 * }
 *
 * function View() {
 *   const {value} = useContext(MyContext)
 *   return (
 *     <Text>{value}</Text>
 *   )
 * }
 *
 * Navigation.present({
 *   element: (
 *     <Provider>
 *       <View/>
 *     </Provider>
 *   )
 * })
 * ```
 */
declare function useContext<T>(context: Context<T>): T;
/**
 * `useSelector` is a Hook that lets you read and subscribe to a prop of context from your component.
 *
 * @example
 * ```tsx
 * const UserContext = createContext<{
 *   name: string
 *   age: number
 *   sex: 'male' | 'female'
 * }>()
 *
 * function Provider({children}: {children: JSX.Element}) {
 *   return (
 *     <UserContext.Provider value={{
 *       name: 'Jerry',
 *       age: 8,
 *       sex: 'female'
 *     }}>
 *     {children}
 *     </UserContext.Provider>
 *   )
 * }
 *
 * function View() {
 *   const name = useSelector(UserContext, context => context.name)
 *   return (
 *     <Text>{name}</Text>
 *   )
 * }
 *
 * Navigation.present({
 *   element: (
 *     <Provider>
 *       <View/>
 *     </Provider>
 *   )
 * })
 * ```
 */
declare function useSelector<T, R>(context: Context<T>, selector: (context: T) => R): R;

/**
 * `useEffect` is a Hook that lets you synchronize a component with an external system.
 *
 *
 * @example
 * ```tsx
 * function ChartRoom({roomId}: {roomId: string}) {
 *   const [messages, setMessages] = useState<string[]>([])
 *
 *   useEffect(() => {
 *     // this setup function runs when your component is added to the page (mounts).
 *
 *     const listener: (message: string) => {
 *       setMessages(list => [message, ...list])
 *     }
 *     subscribeChatMessage(listener)
 *
 *     // return a cleanup function
 *     return () => {
 *       // this function would be called when `roomId` is changed or the component is disposed.
 *       unsubscribeChatMessage(listener)
 *     }
 *   }, [roomId])
 * }
 * ```
 */
declare function useEffect(setup: EffectSetup, deps: any[]): void;

/**
 * `useMemo` is a Hook that lets you cache the result of a calculation between re-renders.
 * Call useMemo at the top level of your component to cache a calculation between re-renders:
 *
 * `calculateValue`: The function calculating the value that you want to cache.
 * It should be pure, should take no arguments, and should return a value of any type.
 * This function would be called during the initial render. On next renders, would
 * return the same value again if the dependencies have not changed since the last render.
 * Otherwise, it will call calculateValue, return its result, and store it so it can be
 * reused later.
 *
 * `deps`: The list of all reactive values referenced inside of the calculateValue code.
 * Reactive values include props, state, and all the variables and functions declared
 * directly inside your component body. The list of dependencies must have a constant number of items and be written inline like `[dep1, dep2, dep3]`.
 * Will compare each dependency with its previous value using the `Object.is` comparison.
 *
 *
 * @example
 * ```tsx
 * type Item = {time: number}
 * function View({list}: {list: Item[]}) {
 *   const [filterTime, setFilterTime] = useState(Date.now())
 *   const visibleItems = useMemo(() => {
 *      return list.filter(item => item.time <= filterTime)
 *   }, [list, filterTime])
 *
 *   return (
 *     <List
 *       itemCount={visibleItems.length}
 *       itemBuilder={index => (
 *          <YourListItemView item={visibleItems[index]} />
 *       )}
 *     >
 *      <ForEach count={visibleItems.length}
 *        itemBuilder={index => (
 *          <YourListItemView item={visibleItems[index]} />
 *        )}
 *      />
 *     </List>
 *   )
 * }
 * ```
 */
declare function useMemo<T>(calculateValue: () => T, deps: any[]): T;

/**
 * `useReducer` is a Hook that lets you add a reducer to your component.
 * Call `useReducer` at the top level of your component to manage its state with a reducer.
 *
 * The `reducer` function that specifies how the state gets updated. It must be pure,
 * should take the state and action as arguments, and should return the next state. State and action can be of any types.
 *
 * The value from which the `initialState` is calculated. It can be a value of any type.
 * How the initial state is calculated from it depends on the next init argument.
 *
 * The `initializer` function that should return the initial state. If it’s not specified,
 * the initial state is set to `initialArg`. Otherwise, the initial state is set to the
 * result of calling `initializer(initialArg)`.
 *
 * `useReducer` returns an array with exactly two items:
 *   - The `current state` of this state variable, initially set to the initial state you provided.
 *   - The `dispatch function` that lets you change it in response to interaction.
 *
 * To update what’s on the screen, call dispatch with an object representing what the user did, called an action.
 *
 *
 * @example
 * ```tsx
 * type State = {
 *   username: string
 *   password: string
 * }
 * type UpdateUsernameAction = {
 *   type: 'updateUsername'
 *   payload: string
 * }
 * type UpdatePasswordAction = {
 *   type: 'updatePassword'
 *   payload: string
 * }
 * type Action = UpdateUsernameAction | UpdatePasswordAction
 * function Reducer(state: State, action: Action): State {
 *   switch (action.type) {
 *     case 'updateUsername':
 *       return { ...state, username: action.payload }
 *     case 'updatePassword':
 *       return { ...state, password: action.payload }
 *   }
 * }
 * const initialState: State = {
 *   username: '',
 *   password: '',
 * }
 *
 * function FormView() {
 *   const [state, dispatch] = useReducer(Reducer, initialState)
 *
 *   function updateUsername(value: string) {
 *     dispatch({
 *       type: 'updateUsername',
 *       payload: value,
 *     })
 *   }
 *
 *   function updatePassword(value: string) {
 *     dispatch({
 *       type: 'updatePassword',
 *       payload: value,
 *     })
 *   }
 *
 *   return (
 *     <Form>
 *       <TextField
 *         prompt="User Name"
 *         value={state.username}
 *         onChanged={updateUsername}
 *       />
 *       <TextField
 *         prompt="Password"
 *         value={state.password}
 *         onChanged={updatePassword}
 *       />
 *     </From>
 *   )
 * }
 * ```
 */
declare function useReducer<R extends Reducer<any, any>, I>(reducer: R, initializerArg: I & ReducerState<R>, initializer: (arg: I & ReducerState<R>) => ReducerState<R>): [ReducerState<R>, Dispatch<ReducerAction<R>>];
declare function useReducer<R extends Reducer<any, any>>(reducer: R, initialState: ReducerState<R>, initializer?: undefined): [ReducerState<R>, Dispatch<ReducerAction<R>>];

/**
 * `useState` is a Hook that lets you add a state variable to your component.
 * Call `useState` at the top level of your component to declare a state variable.
 *
 * `useState` returns an array with exactly two values:
 *   - The current state. During the first render, it will match the initialState you have passed.
 *   - The set function that lets you update the state to a different value and trigger a re-render.
 *
 *
 * @example
 * ```tsx
 * function App() {
 *   const [count, setCount] = useState()
 *
 *   // The `setCount` function returned by useState lets you update the state to a different value
 *   // and trigger a re-render. You can pass the next state directly, or a function that
 *   // calculates it from the previous state:
 *   function handlePlus() {
 *      setCount(count + 1)
 *   }
 *   function handleMinus() {
 *      setCount(count => count - 1)
 *   }
 *
 *   return (
 *     <HStack>
 *       <Button title="Minus" action={handleMinus} />
 *       <Text>{count}</Text>
 *       <Button title="Plus" action={handlePlus}>
 *     </HStack>
 *   )
 * }
 * ```
 */
declare function useState<T = undefined>(): [T | undefined, (state: SetStateAction<T | undefined>) => void];
declare function useState<T>(value: T | StateInitializer<T>): [T, (state: SetStateAction<T>) => void];

/**
 *
 */
declare function useEffectEvent<T extends any[], R>(callback: ComponentEffectEvent<T, R>): ComponentEffectEvent<T, R>;

type RefObject<T> = {
    readonly current: T | null;
};
type MutableRefObject<T> = {
    current: T;
};
/**
 * `useRef` is a Hook that lets you reference a value that’s not needed for rendering.
 *
 * @example
 * ```tsx
 * function App() {
 *   const [count, setCount] = useState(0)
 *   const timerIdRef = useRef<number>() // MutableRefObject
 *
 *   useEffect(() => {
 *     function startTimer() {
 *       timerIdRef.current = setTimeout(() => {
 *         startTimer()
 *         setCount(count => count + 1)
 *       }, 1000)
 *     }
 *     return () => {
 *       if (timerIdRef.current != null) {
 *          clearTimeout(timerIdRef.current)
 *       }
 *     }
 *   }, [])
 *
 *   return (
 *     <Text>{count}</Text>
 *   )
 * }
 * ```
 */
declare function useRef<T>(initialValue: T): MutableRefObject<T>;
declare function useRef<T>(initialValue: T | null): RefObject<T>;
declare function useRef<T = undefined>(): MutableRefObject<T | undefined>;

declare function createElement<P = {}>(type: FunctionComponent<P>, props: ComponentProps<P>, ...children: VirtualNode[]): VirtualNode;
type CreateElementFunc = typeof createElement;
declare global {
    const createElement: CreateElementFunc;
    const Fragment: FunctionComponent<any>;
}

type AnimatedFramesProps = {
    /**
     * The animation duration, in seconds.
     */
    duration: DurationInSeconds;
    /**
     * The array of views to toggle as the frames of the animation. Each child will be displayed sequentially during the animation.
     */
    children: VirtualNode[];
};
/**
 * A view allows you to display a frame animation in a widget by cycling through the provided child views as frames. The duration of the animation is customizable, and each frame corresponds to a view passed in as a child element.
 * @example
 * ```tsx
 * <AnimatedFrames
 *   duration={4}
 * >
 *   <Circle
 *     fill="red"
 *     frame={{
 *       width: 20,
 *       height: 20,
 *     }}
 *   />
 *   <Circle
 *     fill="red"
 *     frame={{
 *       width: 25,
 *       height: 25,
 *     }}
 *   />
 *   <Circle
 *     fill="red"
 *     frame={{
 *       width: 30,
 *       height: 30,
 *     }}
 *   />
 *   <Circle
 *     fill="red"
 *     frame={{
 *       width: 35,
 *       height: 35,
 *     }}
 *   />
 * </AnimatedFrames>
 * ```
 */
declare const AnimatedFrames: FunctionComponent<AnimatedFramesProps>;

type AnimatedGifProps = {
    /**
     * The file path of the GIF image.
     */
    path: string;
    /**
     * The animation duration in seconds. If not provided, the default duration of the GIF is used.
     */
    duration?: DurationInSeconds;
};
/**
 * This views renders an animated GIF in a widget. You can provide a custom path to the GIF file, and optionally, a duration for the animation.
 * @example
 * ```tsx
 * <AnimatedFrame
 *   path={
 *     Path.join(
 *       Script.directory,
 *       "test.gif"
 *     )
 *   }
 *   duration={4}
 * />
 * ```
 */
declare const AnimatedGif: FunctionComponent<AnimatedGifProps>;

/**
 * Hex string: `#FF0033` or `#333`
 */
type ColorStringHex = `#${string}`;
/**
 * RGBA string: `rgba(0,0,0,0.5)`.
 * This is same as css color string.
 *
 *  - R: red, 0 - 255
 *  - G: green, 0 - 255
 *  - B: blue, 0 - 255
 *  - A: alpha, 0 - 1
 */
type ColorStringRGBA = `rgba(${number},${number},${number},${number})`;
/**
 * Duration in milliseconds, one second is `1000`.
 */
type DurationInMilliseconds = number;
/**
 * Constants that define how a view’s content fills the available space.
 */
type ContentMode = 'fit' | 'fill';
/**
 * The horizontal or vertical dimension in a 2D coordinate system.
 */
type Axis = 'vertical' | 'horizontal';
/**
 * An efficient set of axes.
 */
type AxisSet = 'vertical' | 'horizontal' | 'all';
type ColorScheme = 'light' | 'dark';
type Visibility = 'automatic' | 'hidden' | 'visible';
/**
 * A type that defines the placement of a toolbar item.
 *  - `automatic`: The system places the item automatically, depending on many factors including the platform, size class, or presence of other items.
 *  - `bottomBar`: Places the item in the bottom toolbar.
 *  - `cancellationAction`: The item represents a cancellation action for a modal interface.
 *  - `confirmationAction`: The item represents a confirmation action for a modal interface.
 *  - `destructiveAction`: The item represents a destructive action for a modal interface.
 *  - `keyboard`: The item is placed in the keyboard section.
 *  - `navigation`: The item represents a navigation action.
 *  - `primaryAction`: The item represents a primary action.
 *  - `principal`: The system places the item in the principal item section.
 *  - `secondaryAction`: The item represents a secondary action.
 *  - `status`: The item represents a change in status for the current context.
 *  - `topBarLeading`: Places the item in the leading edge of the top bar.
 *  - `topBarTrailing`: Places the item in the trailing edge of the top bar.
 */
type ToolbarItemPlacement = 'automatic' | 'bottomBar' | 'cancellationAction' | 'confirmationAction' | 'destructiveAction' | 'keyboard' | 'navigation' | 'primaryAction' | 'principal' | 'secondaryAction' | 'status' | 'topBarLeading' | 'topBarTrailing';
/**
 *  - `automatic`: The system places the item automatically, depending on many factors including the platform, size class, or presence of other items.
 *  - `bottomBar`: Places the item in the bottom toolbar.
 *  - `cancellationAction`: The item represents a cancellation action for a modal interface.
 *  - `confirmationAction`: The item represents a confirmation action for a modal interface.
 *  - `destructiveAction`: The item represents a destructive action for a modal interface.
 *  - `keyboard`: The item is placed in the keyboard section.
 *  - `navigation`: The item represents a navigation action.
 *  - `primaryAction`: The item represents a primary action.
 *  - `principal`: The system places the item in the principal item section.
 *  - `topBarLeading`: Places the item in the leading edge of the top bar.
 *  - `topBarTrailing`: Places the item in the trailing edge of the top bar.
 */
type ToolBarProps = {
    bottomBar?: VirtualNode | VirtualNode[];
    cancellationAction?: VirtualNode | VirtualNode[];
    confirmationAction?: VirtualNode | VirtualNode[];
    destructiveAction?: VirtualNode | VirtualNode[];
    keyboard?: VirtualNode | VirtualNode[];
    navigation?: VirtualNode | VirtualNode[];
    primaryAction?: VirtualNode | VirtualNode[];
    principal?: VirtualNode | VirtualNode[];
    topBarLeading?: VirtualNode | VirtualNode[];
    topBarTrailing?: VirtualNode | VirtualNode[];
};
/**
 * A type that defines the behavior of title of a toolbar.
 */
type ToolbarTitleDisplayMode = 'automatic' | 'inline' | 'large';
/**
 * Defines the shape of a rounded rectangle’s corners.
 *  - `circular`: Quarter-circle rounded rect corners.
 *  - `continuous`: Continuous curvature rounded rect corners.
 */
type RoundedCornerStyle = 'circular' | 'continuous';
type KeywordPoint = 'top' | 'topLeading' | 'topTrailing' | 'bottom' | 'bottomLeading' | 'bottomTrailing' | 'leading' | 'trailing' | 'center' | 'zero';
type ToggleStyle = 'automatic' | 'switch' | 'button';
type ButtonBorderShape = 'automatic' | 'capsule' | 'circle' | 'roundedRectangle' | 'buttonBorder' | {
    roundedRectangleRadius: number;
};
type LabelStyle = 'automatic' | 'titleOnly' | 'titleAndIcon' | 'iconOnly';
/**
 *
 *  - `automatic`: The default picker style, based on the picker’s context.
 *  - `inline`: A PickerStyle where each option is displayed inline with other views in the current container.
 *  - `menu`: A picker style that presents the options as a menu when the user presses a button, or as a submenu when nested within a larger menu.
 *  - `navigationLink`: A picker style represented by a navigation link that presents the options by pushing a List-style picker view.
 *  - `palette`: A picker style that presents the options as a row of compact elements.
 *  - `segmented`: A picker style that presents the options in a segmented control.
 *  - `wheel`: A picker style that presents the options in a scrollable wheel that shows the selected option and a few neighboring options.
 */
type PickerStyle = 'automatic' | 'inline' | 'menu' | 'navigationLink' | 'segmented' | 'palette' | 'wheel';
/**
 *  - `columns`: A non-scrolling form style with a trailing aligned column of labels next to a leading aligned column of values.
 *  - `grouped`: Rows in a grouped rows form have leading aligned labels and trailing aligned controls within visually grouped sections.
 */
type FormStyle = 'automatic' | 'columns' | 'grouped';
/**
 *  - `automatic`: The default gauge view style in the current context of the view being styled.
 *  - `accessoryCircular`: A gauge style that displays an open ring with a marker that appears at a point along the ring to indicate the gauge’s current value.
 *  - `accessoryCircularCapacity`: A gauge style that displays a closed ring that’s partially filled in to indicate the gauge’s current value.
 *  - `circular`: **(Onlay available on watchOS)** A gauge style that displays an open ring with a marker that appears at a point along the ring to indicate the gauge’s current value.
 *  - `linearCapacity`: A gauge style that displays a bar that fills from leading to trailing edges as the gauge’s current value increases.
 *  - `accessoryLinear`: A gauge style that displays bar with a marker that appears at a point along the bar to indicate the gauge’s current value.
 *  - `accessoryLinearCapacity`: A gauge style that displays bar that fills from leading to trailing edges as the gauge’s current value increases.
 *  - `linear`: **(Only available on watchOS)** A gauge style that displays a bar with a marker that appears at a point along the bar to indicate the gauge’s current value.
 */
type GaugeStyle = 'automatic' | 'accessoryCircular' | 'accessoryCircularCapacity' | 'circular' | 'linearCapacity' | 'accessoryLinear' | 'accessoryLinearCapacity' | 'linear';
/**
 *  - `automatic`: The list style that describes a platform’s default behavior and appearance for a list.
 *  - `bordered`: The list style that describes the behavior and appearance of a list with standard border.
 *  - `carousel`: The carousel list style.
 *  - `elliptical`: The list style that describes the behavior and appearance of an elliptical list.
 *  - `grouped`: The list style that describes the behavior and appearance of a grouped list.
 *  - `inset`: The list style that describes the behavior and appearance of an inset list.
 *  - `insetGroup`: The list style that describes the behavior and appearance of an inset grouped list.
 *  - `plain`: The list style that describes the behavior and appearance of a plain list.
 *  - `sidebar`: The list style that describes the behavior and appearance of a sidebar list.
 */
type ListStyle = 'automatic' | 'bordered' | 'carousel' | 'elliptical' | 'grouped' | 'inset' | 'insetGroup' | 'plain' | 'sidebar';
/**
 *  - `automatic`: The default progress view style in the current context of the view being styled.
 *  - `circular`: The style of a progress view that uses a circular gauge to indicate the partial completion of an activity. On platforms other than macOS, the circular style may appear as an indeterminate indicator instead.
 *  - `linear`: A progress view that visually indicates its progress using a horizontal bar.
 */
type ProgressViewStyle = 'linear' | 'circular' | 'automatic';
type TextFieldStyle = 'automatic' | 'plain' | 'roundedBorder';
type NavigationBarTitleDisplayMode = 'automatic' | 'inline' | 'large';
type MenuStyle = 'automatic' | 'button' | 'borderlessButton';
/**
 *  - `compactMenu`: A control group style that presents its content as a compact menu when the user presses the control, or as a submenu when nested within a larger menu.
 *  - `menu`: A control group style that presents its content as a menu when the user presses the control, or as a submenu when nested within a larger menu.
 *  - `navigation`: The navigation control group style.
 *  - `palette`: A control group style that presents its content as a palette.
 */
type ControlGroupStyle = 'automatic' | 'compactMenu' | 'menu' | 'navigation' | 'palette';
/**
 *  - `automatic`: The default button style, based on the button’s context.
 *  - `bordered`: A button style that applies standard border artwork based on the button’s context.
 *  - `borderedProminent`: A button style that applies standard border prominent artwork based on the button’s context.
 *  - `borderless`: A button style that doesn’t apply a border.
 *  - `plain`: A button style that doesn’t style or decorate its content while idle, but may apply a visual effect to indicate the pressed, focused, or enabled state of the button.
 */
type ButtonStyle = 'automatic' | 'bordered' | 'borderless' | 'borderedProminent' | 'plain';
/**
 *  - `automatic`: The default tab view style.
 *  - `page`: A TabViewStyle that displays a paged scrolling TabView.
 *  - `sidebarAdaptable`: (iOS 18.0+) A tab bar style that adapts to each platform.
 *  - `tabBarOnly`: (iOS 18.0+) A tab view style that displays a tab bar when possible.
 *  - `pageAlwaysDisplayIndex`: Always display an index view regardless of page count
 *  - `pageAutomaticDisplayIndex`: Displays an index view when there are more than one page
 *  - `pageNeverDisplayIndex`: Never display an index view
 */
type TabViewStyle = "automatic" | "page" | "sidebarAdaptable" | "tabBarOnly" | "pageAlwaysDisplayIndex" | "pageAutomaticDisplayIndex" | "pageNeverDisplayIndex";
/**
 * A rectangular shape with rounded corners with different values, aligned inside the frame of the view containing it.
 */
type RectCornerRadii = {
    topLeading?: number;
    bottomLeading?: number;
    bottomTrailing?: number;
    topTrailing?: number;
};
type EdgeInsets = {
    top: number;
    leading: number;
    bottom: number;
    trailing: number;
};
type Edge = 'top' | 'leading' | 'trailing' | 'bottom';
/**
 * The visibility of scroll indicators of a UI element.
 *  - `automatic`: Scroll indicator visibility depends on the policies of the component accepting the visibility configuration.
 *  - `visible`: The actual visibility of the indicators depends on platform conventions like auto-hiding behaviors in iOS or user preference behaviors in macOS.
 *  - `hidden`: By default, scroll views in macOS show indicators when a mouse is connected. Use `never` to indicate a stronger preference that can override this behavior.
 *  - `never`: Scroll indicators should never be visible.
 */
type ScrollScrollIndicatorVisibility = "automatic" | "visible" | "hidden" | "never";
/**
 * The ways that scrollable content can interact with the software keyboard.
 *  - `automatic`: Determine the mode automatically based on the surrounding context.
 *  - `immediately`: Dismiss the keyboard as soon as scrolling starts.
 *  - `interactively`: Enable people to interactively dismiss the keyboard as part of the scroll operation.
 *  - `never`: Never dismiss the keyboard automatically as a result of scrolling.
 */
type ScrollDismissesKeyboardMode = "automatic" | "immediately" | "interactively" | "never";
/**
 *  - `rect`: A rectangular shape with rounded corners with different values, aligned inside the frame of the view containing it.
 *  - `circle`: A circle centered on the frame of the view containing it. The circle’s radius equals half the length of the frame rectangle’s smallest edge.
 *  - `capsule`: A capsule shape aligned inside the frame of the view containing it. A capsule shape is equivalent to a rounded rectangle where the corner radius is chosen as half the length of the rectangle’s smallest edge.
 *  - `ellipse`: An ellipse aligned inside the frame of the view containing it.
 *  - `buttonBorder`: A shape that defers to the environment to determine the resolved button border shape.
 *  - `containerRelative`: A shape that is replaced by an inset version of the current container shape. If no container shape was defined, is replaced by a rectangle.
 */
type Shape = 'rect' | 'circle' | 'capsule' | 'ellipse' | 'buttonBorder' | 'containerRelative' | {
    type: 'capsule';
    style: RoundedCornerStyle;
} | {
    type: 'rect';
    /**
     * A rectangular shape with rounded corners, aligned inside the frame of the view containing it.
     */
    cornerRadius: number;
    style?: RoundedCornerStyle;
} | {
    type: 'rect';
    cornerSize: {
        width: number;
        height: number;
    };
    style?: RoundedCornerStyle;
} | {
    type: 'rect';
    cornerRadii: RectCornerRadii;
    style?: RoundedCornerStyle;
};
type Font = "largeTitle" | "title" | "title2" | "title3" | "headline" | "subheadline" | "body" | "callout" | "footnote" | "caption" | "caption2";
type FontWeight = "ultraLight" | "thin" | "light" | "regular" | "medium" | "semibold" | "bold" | "heavy" | "black";
/**
 * A width to use for fonts that have multiple widths.
 */
type FontWidth = "compressed" | "condensed" | "expanded" | "standard";
type FontDesign = 'default' | 'monospaced' | 'rounded' | 'serif';
type TextAlignment = 'leading' | 'center' | 'trailing';
type KeyboardType = 'default' | 'numberPad' | 'phonePad' | 'namePhonePad' | 'URL' | 'decimalPad' | 'asciiCapable' | 'asciiCapableNumberPad' | 'emailAddress' | 'numbersAndPunctuation' | 'twitter' | 'webSearch';
/**
 * The kind of autocapitalization behavior applied during text input.
 *  - `never`: Defines an autocapitalizing behavior that will not capitalize anything.
 *  - `characters`: Defines an autocapitalizing behavior that will capitalize every letter.
 *  - `sentences`: Defines an autocapitalizing behavior that will capitalize the first letter in every sentence.
 *  - `words`: Defines an autocapitalizing behavior that will capitalize the first letter of every word.
 */
type TextInputAutocapitalization = "never" | "characters" | "sentences" | "words";
/**
 * A type that defines various triggers that result in the firing of a submission action.
 *  - `search`: Defines triggers originating from search fields constructed from `searchable` modifiers.
 *  - `text`: Defines triggers originating from text input controls like `TextField` and `SecureField`.
 */
type SubmitTriggers = "search" | "text";
/**
 * A set of alignments that represent common combinations of the built-in horizontal and vertical alignment guides. The blue boxes in the following diagram demonstrate the alignment named by each box’s label, relative to the background view:
 * ![Alignment](https://docs-assets.developer.apple.com/published/09693fd98ab76356519a900fd33d9e7f/Alignment-1-iOS@2x.png)
 */
type Alignment = "top" | "center" | "bottom" | "leading" | "trailing" | "bottomLeading" | "bottomTrailing" | "centerFirstTextBaseline" | "centerLastTextBaseline" | "leadingFirstTextBaseline" | "leadingLastTextBaseline" | "topLeading" | "topTrailing" | "trailingFirstTextBaseline" | "trailingLastTextBaseline";
/**
 * The position of an annotation.
 */
type AnnotationPosition = "automatic" | "bottom" | "bottomLeading" | "bottomTrailing" | "leading" | "overlay" | "top" | "topLeading" | "topTrailing" | "trailing";
type AnnotationOverflowResolution = {
    /**
     * The strategy to resolve X overflow.
     */
    x?: AnnotationOverflowResolutionStrategy;
    /**
     * The strategy to resolve Y overflow.
     */
    y?: AnnotationOverflowResolutionStrategy;
};
/**
 *  - `fit`: Fits the annotation automatically, adjusting its position to ensure it doesn't overflow.
 *  - `fitTo**`: Fits the annotation to the given boundary, adjusting its position to ensure it doesn't overflow.
 *  - `padScale`: Pads the scale of the chart to make space for the annotation.
 *  - `disabled`: Places the annotation "as-is".
 *  - `automatic`: Automatically chooses a overflow resolution.
 */
type AnnotationOverflowResolutionStrategy = 'automatic' | 'fit' | 'fitToPlot' | 'fitToChart' | 'fitToAutomatic' | 'padScale' | 'disabled';
/**
 * Use horizontal alignment guides to tell view how to position views relative to one another horizontally, like when you place views vertically in an VStack. The following example demonstrates common built-in horizontal alignments:
 * ![Horizontal Alignment](https://docs-assets.developer.apple.com/published/cb8ad6030a1ebcfee545d02f406500ee/HorizontalAlignment-1-iOS@2x.png)
 */
type HorizontalAlignment = 'leading' | 'center' | 'trailing';
/**
 * Use vertical alignment guides to position views relative to one another vertically, like when you place views side-by-side in an HStack . The following example demonstrates common built-in vertical alignments:
 * ![Vertical Alignment](https://docs-assets.developer.apple.com/published/a63aa800a94319cd283176a8b21bb7af/VerticalAlignment-1-iOS@2x.png)
 */
type VerticalAlignment = "top" | "center" | "bottom" | "firstTextBaseline" | "lastTextBaseline";
type ClosedRange<T extends number | Date> = { from: T; to: T }
type DatePickerStyle = 'automatic' | 'compact' | 'inline' | 'wheel';
type SearchFieldPlacement = 'automatic' | 'navigationBarDrawer' | 'sidebar' | 'toolbar';
type SearchSuggestionsPlacementSet = 'content' | 'keyboard' | 'toolbar';
type SensoryFeedback = 'success' | 'warning' | 'error' | 'selection' | 'impactLight' | 'impactMedium' | 'impactHeavy';

/**
 * 型別補強：手機端 Scriptable/Scripting App 常用全域型別
 * 若未宣告則補上，避免 UI/Storage/圖片/拖曳等型別錯誤
 */
type UTType = string;
type UIImage = any;

declare namespace Script {
  const Storage: {
    get(key: string): Promise<any>;
    set(key: string, value: any): Promise<void>;
    remove(key: string): Promise<void>;
  };
  function render(node: VirtualNode): void;
}
