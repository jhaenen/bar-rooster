// See https://kit.svelte.dev/docs/types#app

import type { Database } from "sqlite3";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			db: Database
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
