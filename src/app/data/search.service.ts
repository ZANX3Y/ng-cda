import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'
import CacheService from './cache.service'
import CacheList from './CacheList'
import Config from './Config'

@Injectable({
    providedIn: 'root',
})
export class SearchService extends CacheService<CacheSearch> {
    queries: Record<string, SearchQuery> = {}

    protected create = (key: string) => CacheSearch.create(key)

    protected fetch = (query: string, page: number) =>
        this.http.post(Config.api('/search'), { query, page })

    private getQuery(query: string): SearchQuery {
        if (!this.queries[query])
            this.queries[query] = SearchQuery.create(query)

        return this.queries[query]
    }

    private fetchSuggestions = (query: string) =>
        this.http.post<string[]>(Config.api('/search/suggest'), { query })

    getSuggestions = (query: string): Observable<string[]> =>
        new Observable(observer => {
            const cache = this.getQuery(query)

            if (cache.suggestions.length > 0) {
                observer.next(cache.suggestions)
                observer.complete()
                return
            }

            this.fetchSuggestions(query).subscribe(suggestions => {
                cache.suggestions = suggestions
                cache.save()

                observer.next(suggestions)
                observer.complete()
            })
        })
}

class CacheSearch extends CacheList {
    static override lifetime = 30 * 1000
    static override cacheKey = 'Search'
}

class SearchQuery {
    private constructor(
        public query: string,
        public suggestions: string[],
        private timestamp: number,
    ) {}

    public isExpired = () => Date.now() - this.timestamp > 1000 * 60 * 60

    public save = () => localStorage.setItem(`Cache.Query-${this.query}`, JSON.stringify(this))

    public static create = (query: string) => {
        const ls = localStorage.getItem(`Cache.Query-${query}`)

        if (ls) {
            const json = JSON.parse(ls)
            const suggestion = new this(json.query, json.suggestions, json.timestamp)

            if (!suggestion.isExpired())
                return suggestion
        }

        return new this(query, [], Date.now())
    }
}
