/**
 * @swagger
 * /auth/signup:
 *  post:
 *    summary: 회원 생성
 *    description: 회원 생성
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              userId:
 *                type: string
 *              password:
 *                type: string
 *              name:
 *                type: string
 *              role:
 *                type: string
 *    responses:
 *      201:
 *        description: 성공
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                result:
 *                  type: string
 *              example:
 *                result: success
 */

/**
 * @swagger
 * /auth/duplicate-check:
 *  get:
 *    summary: 사용자 ID 중복 확인
 *    description: 주어진 사용자 ID가 사용 가능한지 확인합니다.
 *    tags: [Auth]
 *    parameters:
 *      - in: query
 *        name: userId
 *        schema:
 *          type: string
 *        required: true
 *        description: 확인할 사용자 ID
 *    responses:
 *      200:
 *        description: 사용자 ID의 사용 가능
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                available:
 *                  type: boolean
 *                  description: 사용자 ID가 사용 가능
 *              example:
 *                available: true
 *      409:
 *        description: 사용자 ID의 사용 불가능
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                available:
 *                  type: boolean
 *                  description: 사용자 ID가 사용 불가능
 *              example:
 *                available: false
 */

/**
 * @swagger
 * /auth/login:
 *  post:
 *    summary: 사용자 로그인
 *    description: 사용자의 자격 증명을 확인하고 JWT 토큰을 반환합니다.
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              userId:
 *                type: string
 *                description: 로그인할 사용자 ID
 *              password:
 *                type: string
 *                description: 사용자 비밀번호
 *            required:
 *              - userId
 *              - password
 *          example:
 *            userId: "testuser"
 *            password: "password123"
 *    responses:
 *      200:
 *        description: 로그인 성공 및 JWT 토큰 반환
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                token:
 *                  type: string
 *                  description: JWT 토큰
 *              example:
 *                token: "token"
 *      401:
 *        description: 인증 실패
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  description: 오류 메시지
 *              example:
 *                error: "에러 메시지."
 */

/**
 * @swagger
 * /auth/token:
 *  post:
 *    summary: 토큰 갱신
 *    description: 기존의 refreshToken을 사용하여 새로운 accessToken을 발급받습니다.
 *    tags: [Auth]
 *    parameters:
 *      - in: cookie
 *        name: refreshToken
 *        schema:
 *          type: string
 *        required: true
 *        description: 클라이언트에서 발급된 refreshToken 쿠키
 *    responses:
 *      200:
 *        description: 새로운 accessToken이 발급됨
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                token:
 *                  type: string
 *                  description: 새로운 JWT accessToken
 *              example:
 *                token: "token"
 *      401:
 *        description: 인증 실패 (refreshToken이 없음)
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  description: 오류 메시지
 *              example:
 *                error: "Unauthorized"
 *      500:
 *        description: 서버 오류
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  description: 오류 메시지
 *              example:
 *                error: "서버 오류 발생"
 */
