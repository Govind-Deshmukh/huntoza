// src/hooks/redux.js
import { useDispatch, useSelector } from "react-redux";

// Custom hooks for Redux
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
