import { optimize } from "../algorithm/simAnnealing.js";

var status = 'stopped';

export function start(route, points, frequency) {
    status = 'running';
    optimize(route, points, frequency);
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