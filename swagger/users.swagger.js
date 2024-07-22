/**
 * @swagger
 * /users/{id}:
 *  get:
 *    summary: 사용자 정보 조회
 *    description: 로그인한 사용자가 자신의 정보를 조회합니다.
 *    tags: [User]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *        description: 조회할 사용자 ID
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: 사용자 정보가 성공적으로 조회됨
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  type: integer
 *                  description: 사용자 ID
 *                userId:
 *                  type: string
 *                  description: 사용자 ID (로그인 ID)
 *                name:
 *                  type: string
 *                  description: 사용자 이름
 *                role:
 *                  type: string
 *                  description: 사용자 역할
 *                createdAt:
 *                  type: string
 *                  format: date-time
 *                  description: 계정 생성 날짜 및 시간
 *                updatedAt:
 *                  type: string
 *                  format: date-time
 *                  description: 마지막 수정 날짜 및 시간
 *                deletedAt:
 *                  type: string
 *                  format: date-time
 *                  nullable: true
 *                  description: 계정 삭제 날짜 및 시간 (삭제되지 않은 경우 `null`)
 *              example:
 *                id: 1
 *                userId: "test"
 *                name: "테스터"
 *                role: "임시"
 *                createdAt: "2024-07-19T08:43:50.239Z"
 *                updatedAt: "2024-07-19T08:43:50.239Z"
 *                deletedAt: null
 *      403:
 *        description: 권한 부족 (다른 사용자의 정보 조회 시)
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  description: 오류 메시지
 *              example:
 *                error: "Forbidden"
 *      401:
 *        description: 인증 실패 (토큰이 없거나 유효하지 않음)
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


/**
 * @swagger
 * /users/{id}:
 *  put:
 *    summary: 비밀번호 수정
 *    description: 로그인한 사용자가 자신의 비밀번호를 수정합니다.
 *    tags: [User]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *        description: 비밀번호를 수정할 사용자 ID
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              password:
 *                type: string
 *                description: 새로운 비밀번호
 *            required:
 *              - password
 *            example:
 *              password: "newPassword123!"
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: 비밀번호가 성공적으로 수정됨
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                updatedCount:
 *                  type: int
 *                  description: 성공 카운트
 *              example:
 *                "updatedCount": 1
 *      403:
 *        description: 권한 부족 (다른 사용자의 비밀번호 수정 시)
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  description: 오류 메시지
 *              example:
 *                error: "Forbidden"
 *      401:
 *        description: 인증 실패 (토큰이 없거나 유효하지 않음)
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
