import { optimize } from "../algorithm/simAnnealing.js";

var status = 'stopped';

export function start(route, points) {
    status = 'running';
    optimize(route, points);
}

export function pause() {
    status = 'paused';
}

export function resume() {
    status = 'running';
}

export function stop() {
    status = 'stopped';
}

export function get_status() {
    return status;
}