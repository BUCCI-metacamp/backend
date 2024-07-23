/**
 * @swagger
 * /dashboard/uptime:
 *  get:
 *    summary: 가동 시간 조회
 *    description: 제일 최근 가동 정보를 조회합니다.
 *    tags: [Dashboard]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: 가동 시간이 성공적으로 조회됨
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                time:
 *                  type: string
 *                  description: 가동 / 가동 중지 시간
 *                value:
 *                  type: boolean
 *                  description: 서버가 켜졌는지 여부
 *              example:
 *                time: "2024-07-23T04:29:27.386Z"
 *                value: true
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
