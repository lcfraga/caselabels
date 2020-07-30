@file:Suppress("PARAMETER_NAME_CHANGED_ON_OVERRIDE")

import io.kotest.matchers.Matcher
import io.kotest.matchers.MatcherResult
import io.kotest.matchers.should
import io.kotest.matchers.shouldNot
import io.ktor.client.statement.HttpResponse
import io.ktor.http.Cookie
import io.ktor.http.HttpStatusCode
import io.ktor.http.setCookie

fun containCookies() = object : Matcher<HttpResponse> {
    override fun test(httpResponse: HttpResponse) = MatcherResult(
        passed = httpResponse.setCookie().isNotEmpty(),
        failureMessage = "HTTP response should contain at least one cookie",
        negatedFailureMessage = "HTTP response should contain no cookies; found ${httpResponse.setCookie().size}"
    )
}

fun containCookie(cookie: Cookie) = object : Matcher<HttpResponse> {
    override fun test(httpResponse: HttpResponse) = MatcherResult(
        passed = httpResponse.setCookie().contains(cookie),
        failureMessage = "HTTP response should contain $cookie",
        negatedFailureMessage = "HTTP response should not contain $cookie"
    )
}

fun containCookie(path: String = "/", name: String, value: String, httpOnly: Boolean = false) = object : Matcher<HttpResponse> {
    override fun test(httpResponse: HttpResponse) = MatcherResult(
        passed = httpResponse.setCookie().any {
            it.path == path && it.name == name && it.value == value && it.httpOnly == httpOnly
        },
        failureMessage = "HTTP response should contain ${Cookie(path = path, name = name, value = value, httpOnly = httpOnly)}",
        negatedFailureMessage = "HTTP response should not contain ${Cookie(path = path, name = name, value = value, httpOnly = httpOnly)}"
    )
}

fun haveStatus(httpStatus: HttpStatusCode) = object : Matcher<HttpResponse> {
    override fun test(httpResponse: HttpResponse) = MatcherResult(
        passed = httpResponse.status == httpStatus,
        failureMessage = "HTTP response should have status $httpStatus; found ${httpResponse.status}",
        negatedFailureMessage = "HTTP response should not have status $httpStatus"
    )
}

fun HttpResponse.shouldContainCookies() = this should containCookies()
fun HttpResponse.shouldNotContainCookies() = this shouldNot containCookies()

fun HttpResponse.shouldContainCookie(cookie: Cookie) = this should containCookie(cookie)
fun HttpResponse.shouldNotContainCookie(cookie: Cookie) = this shouldNot containCookie(cookie)

fun HttpResponse.shouldContainCookie(path: String = "/", name: String, value: String, httpOnly: Boolean = false) = this should containCookie(path = path, name = name, value = value, httpOnly = httpOnly)
fun HttpResponse.shouldNotContainCookie(path: String = "/", name: String, value: String, httpOnly: Boolean = false) = this shouldNot containCookie(path = path, name = name, value = value, httpOnly = httpOnly)

fun HttpResponse.shouldHaveStatus(status: HttpStatusCode) = this should haveStatus(status)
fun HttpResponse.shouldNotHaveStatus(status: HttpStatusCode) = this shouldNot haveStatus(status)
