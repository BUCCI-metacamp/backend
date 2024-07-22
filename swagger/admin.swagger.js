/**
 * @swagger
 * /admin/users/{id}/role:
 *  put:
 *    summary: 사용자 역할 수정
 *    description: 관리자가 사용자의 역할을 수정합니다.
 *    tags: [Admin]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *        description: 수정할 사용자 ID
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              role:
 *                type: string
 *                description: 새 역할
 *            required:
 *              - role
 *            example:
 *              role: "admin"
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: 사용자 역할이 성공적으로 수정됨
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                updatedCount:
 *                  type: integer
 *                  description: 수정된 사용자 수
 *              example:
 *                updatedCount: 1
 *      400:
 *        description: 잘못된 요청 (잘못된 데이터 또는 형식)
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  description: 오류 메시지
 *              example:
 *                error: "Bad Request"
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
 *                error: "Unauthorized"
 *      403:
 *        description: 권한 부족 (관리자가 아닌 경우)
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
 * /admin/users/{id}:
 *  delete:
 *    summary: 사용자 삭제
 *    description: 관리자가 사용자를 삭제합니다.
 *    tags: [Admin]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *        description: 삭제할 사용자 ID
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: 사용자가 성공적으로 삭제됨
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                deletedCount:
 *                  type: integer
 *                  description: 삭제된 사용자 수
 *              example:
 *                deletedCount: 1
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
 *                error: "Unauthorized"
 *      403:
 *        description: 권한 부족 (관리자가 아닌 경우)
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
